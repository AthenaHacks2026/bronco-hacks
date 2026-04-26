require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const bucketName = process.env.S3_BUCKET_NAME || "";

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected for item image backfill");

    const items = await Item.find({
      $or: [{ image: { $exists: false } }, { image: "" }],
    });

    let modifiedCount = 0;

    for (const item of items) {
      const candidates = [
        item.imageUrl,
        Array.isArray(item.images) ? item.images[0] : "",
      ]
        .map((value) => String(value || "").trim())
        .filter(Boolean);

      const chosen = candidates[0] || "";
      const referencesS3 = chosen && bucketName ? chosen.includes(bucketName) : false;

      item.image = chosen;

      if (!item.imageUrl && chosen) {
        item.imageUrl = chosen;
      }
      if ((!Array.isArray(item.images) || item.images.length === 0) && chosen) {
        item.images = [chosen];
      }

      await item.save();
      modifiedCount += 1;

      if (chosen) {
        console.log(
          `[updated] ${item._id} image set (${referencesS3 ? "s3" : "non-s3"})`
        );
      } else {
        console.log(`[updated] ${item._id} no image source found`);
      }
    }

    console.log(`Matched ${items.length} items.`);
    console.log(`Updated ${modifiedCount} items.`);
    console.log("Item image backfill complete.");
  } catch (error) {
    console.error("Item image backfill failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
