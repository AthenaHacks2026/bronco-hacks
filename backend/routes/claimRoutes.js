const express = require("express");
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const User = require("../models/User");

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const claims = await Claim.find({ caregiverUserId: req.userId })
      .populate("itemId", "title itemName text category condition status")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ claims });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch claims.",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ message: "itemId is required." });
    }

    const [user, item] = await Promise.all([
      User.findById(req.userId).select("onboarding.userType"),
      Item.findById(itemId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    if (item.status !== "available") {
      return res.status(409).json({
        code: "ITEM_NOT_AVAILABLE",
        message: "Item is not available.",
      });
    }
    if (user?.onboarding?.userType === "donor") {
      return res
        .status(403)
        .json({ message: "Donor accounts cannot request items." });
    }

    let donorUserId =
      item.donorUserId ||
      item.userId ||
      item.ownerUserId ||
      item.ownerId ||
      item.createdByUserId ||
      item.createdBy;

    // Hackathon fallback: if manually inserted items have no owner fields,
    // attach the first donor account so claim flow can complete end-to-end.
    if (!donorUserId) {
      let fallbackDonor = await User.findOne({
        "onboarding.userType": "donor",
        _id: { $ne: req.userId },
      }).select("_id");

      // Extra hackathon fallback: use any other account if no donor profile exists.
      if (!fallbackDonor?._id) {
        fallbackDonor = await User.findOne({
          _id: { $ne: req.userId },
        }).select("_id");
      }

      if (fallbackDonor?._id) {
        donorUserId = fallbackDonor._id;
        await Item.findByIdAndUpdate(item._id, { donorUserId });
      }
    }
    if (!donorUserId) {
      return res
        .status(409)
        .json({
          code: "ITEM_MISSING_DONOR",
          message:
            "Item is missing donor ownership info and no fallback owner account was found.",
        });
    }

    const existingClaim = await Claim.findOne({
      itemId: item._id,
      caregiverUserId: req.userId,
      status: { $in: ["pending", "accepted", "completed"] },
    });
    if (existingClaim) {
      // Keep item availability consistent in case legacy rows were left available.
      if (String(item.status || "").toLowerCase() === "available") {
        await Item.findByIdAndUpdate(item._id, { status: "claimed" });
      }
      return res
        .status(409)
        .json({
          code: "ALREADY_REQUESTED",
          message: "You already have an active request for this item.",
          claim: existingClaim,
        });
    }

    const claim = await Claim.create({
      itemId: item._id,
      caregiverUserId: req.userId,
      donorUserId,
      status: "completed",
    });

    await Item.findByIdAndUpdate(item._id, { status: "claimed" });

    return res.status(201).json({ claim });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create claim.",
      error: error.message,
    });
  }
});

router.patch("/:claimId/status", async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["accepted", "declined", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found." });
    }

    const isCaregiver = String(claim.caregiverUserId) === String(req.userId);
    const isDonor = String(claim.donorUserId) === String(req.userId);

    if (!isCaregiver && !isDonor) {
      return res.status(403).json({ message: "Forbidden." });
    }

    if (status === "cancelled" && !isCaregiver) {
      return res
        .status(403)
        .json({ message: "Only the caregiver can cancel a request." });
    }
    if ((status === "accepted" || status === "declined") && !isDonor) {
      return res
        .status(403)
        .json({ message: "Only the donor can accept or decline requests." });
    }

    claim.status = status;
    await claim.save();

    if (status === "accepted") {
      await Item.findByIdAndUpdate(claim.itemId, { status: "reserved" });
    } else if (status === "completed") {
      await Item.findByIdAndUpdate(claim.itemId, { status: "claimed" });
    } else if (status === "declined" || status === "cancelled") {
      await Item.findByIdAndUpdate(claim.itemId, { status: "available" });
    }

    return res.status(200).json({ claim });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update claim status.",
      error: error.message,
    });
  }
});

module.exports = router;
