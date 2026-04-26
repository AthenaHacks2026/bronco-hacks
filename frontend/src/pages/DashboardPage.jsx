import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const formatReasons = (reasons = []) => {
  if (!reasons.length) return "Matched to your profile and recent onboarding info.";
  return reasons
    .map((reason) => reason.charAt(0).toUpperCase() + reason.slice(1))
    .join(" • ");
};

const isMongoObjectId = (value) => /^[a-f0-9]{24}$/i.test(String(value || ""));

function DashboardPage() {
  const [lookingForItems, setLookingForItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [requestedClaims, setRequestedClaims] = useState([]);
  const [donorItems, setDonorItems] = useState([]);
  const [userType, setUserType] = useState("");
  const [normalizedNeeds, setNormalizedNeeds] = useState([]);
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  const [requestingIds, setRequestingIds] = useState([]);
  const [requestedItemIds, setRequestedItemIds] = useState([]);
  const [requestFeedback, setRequestFeedback] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLookingForItems([]);
          setRecommendedItems([]);
          setRequestedClaims([]);
          setDonorItems([]);
          return;
        }

        const meRes = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentUserType = meRes.data?.user?.onboarding?.userType || "";
        setUserType(currentUserType);

        if (currentUserType === "donor") {
          setLookingForItems([]);
          setRecommendedItems([]);
          setRequestedClaims([]);
          setNormalizedNeeds([]);
          setRecommendedCategories([]);

          const allItemsRes = await axios.get("/api/items");
          const currentUserId = String(meRes.data?.user?._id || "");
          const ownedItems = (allItemsRes.data || []).filter((item) => {
            const donorId =
              item?.donorUserId ||
              item?.userId ||
              item?.ownerUserId ||
              item?.ownerId ||
              item?.createdByUserId ||
              item?.createdBy;
            return String(donorId || "") === currentUserId;
          });
          setDonorItems(ownedItems);
          return;
        }

        setDonorItems([]);

        const res = await axios.get("/api/recommendations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNormalizedNeeds(res.data.normalizedNeeds || []);
        setRecommendedCategories(res.data.recommended?.categories || []);
        setLookingForItems(res.data.lookingFor?.items || []);
        setRecommendedItems(res.data.recommended?.items || []);

        const claimsRes = await axios.get("/api/claims/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const claims = claimsRes.data?.claims || [];
        setRequestedClaims(claims);
        setRequestedItemIds(
          claims
            .map((claim) => String(claim?.itemId?._id || claim?.itemId || ""))
            .filter(Boolean)
        );
      } catch (err) {
        console.error("Recommendations fetch failed:", err);
        setLookingForItems([]);
        setRecommendedItems([]);
        setRequestedClaims([]);
        setDonorItems([]);
      }
    };

    fetchRecommendations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const handleRequestItem = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (requestingIds.includes(item?.id) || isAlreadyRequested(item?.id)) return;

    if (!isMongoObjectId(item?.id)) {
      setRequestFeedback("Only real database items can be requested.");
      return;
    }

    setRequestFeedback("");
    setRequestingIds((prev) => [...prev, item.id]);
    try {
      const createRes = await axios.post(
        "/api/claims",
        { itemId: item.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdClaim = createRes?.data?.claim;
      const optimisticClaim = createdClaim
        ? {
            ...createdClaim,
            itemId: {
              _id: item.id,
              title: item.title,
              itemName: item.title,
              text: item.description,
              category: item.category,
            },
          }
        : null;
      if (optimisticClaim) {
        setRequestedItemIds((prev) =>
          prev.includes(String(item.id)) ? prev : [...prev, String(item.id)]
        );
        setRequestedClaims((prev) => [
          optimisticClaim,
          ...prev.filter((claim) => String(claim?._id) !== String(optimisticClaim._id)),
        ]);
      }

      const claimsRes = await axios.get("/api/claims/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const refreshedClaims = claimsRes.data?.claims || [];
      setRequestedClaims((prev) =>
        refreshedClaims.length === 0 && optimisticClaim ? prev : refreshedClaims
      );
      if (refreshedClaims.length > 0) {
        setRequestedItemIds(
          refreshedClaims
            .map((claim) => String(claim?.itemId?._id || claim?.itemId || ""))
            .filter(Boolean)
        );
      }
      setRecommendedItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
      setLookingForItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
      setRequestFeedback("Item successfully donated and added to your requested items.");
    } catch (error) {
      if (error?.response?.status === 409) {
        const conflictCode = String(error?.response?.data?.code || "");
        const conflictMessage =
          error?.response?.data?.message || "Request could not be completed.";

        if (conflictCode === "ALREADY_REQUESTED") {
          const existingClaim = error?.response?.data?.claim;
          const fallbackClaimId = `existing-${String(item.id)}`;
          const syntheticClaim = {
            ...(existingClaim || {}),
            _id: existingClaim?._id || fallbackClaimId,
            status: existingClaim?.status || "completed",
            itemId: {
              _id: item.id,
              title: item.title,
              itemName: item.title,
              text: item.description,
              category: item.category,
            },
          };

          setRequestedItemIds((prev) =>
            prev.includes(String(item.id)) ? prev : [...prev, String(item.id)]
          );
          setRequestedClaims((prev) => [
            syntheticClaim,
            ...prev.filter(
              (claim) =>
                String(claim?._id) !== String(syntheticClaim._id) &&
                String(claim?.itemId?._id || claim?.itemId) !== String(item.id)
            ),
          ]);
          setRecommendedItems((prev) =>
            prev.filter((candidate) => candidate.id !== item.id)
          );
          setLookingForItems((prev) =>
            prev.filter((candidate) => candidate.id !== item.id)
          );
          setRequestFeedback("You already requested this item.");
          return;
        }

        const claimsRes = await axios.get("/api/claims/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const refreshedClaims = claimsRes.data?.claims || [];
        setRequestedClaims((prev) =>
          refreshedClaims.length === 0 ? prev : refreshedClaims
        );
        if (refreshedClaims.length > 0) {
          setRequestedItemIds(
            refreshedClaims
              .map((claim) => String(claim?.itemId?._id || claim?.itemId || ""))
              .filter(Boolean)
          );
        }
        setRequestFeedback(conflictMessage);
        return;
      }
      setRequestFeedback(
        error?.response?.data?.message || "Failed to submit item request."
      );
    } finally {
      setRequestingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const isAlreadyRequested = (itemId) =>
    requestedItemIds.includes(String(itemId)) ||
    requestedClaims.some(
      (claim) =>
        String(claim?.itemId?._id || claim?.itemId) === String(itemId) &&
        ["pending", "accepted", "completed"].includes(
          String(claim?.status || "")
        )
    );

  return (
    <main className="page">
      <div className="dashboard-top-actions">
        <Link className="button-link" to="/settings">
          Settings
        </Link>
        <Link className="button-link" to="/" onClick={handleLogout}>
          Logout
        </Link>
      </div>

      {userType !== "donor" && (
        <>
          <h2>What you're looking for</h2>
          {normalizedNeeds.length === 0 ? (
            <p>No need tags selected yet.</p>
          ) : (
            <p>Recommendations are based on your selected needs and stage.</p>
          )}

          {lookingForItems.length === 0 ? (
            <p>No direct matches yet.</p>
          ) : (
            <section className="recommendations-list">
              {lookingForItems.map((item) => (
                <article key={item.id} className="recommendation-card">
                  <p className="recommendation-category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className="recommendation-why">
                    Why this is recommended: {formatReasons(item.reasons)}
                  </p>
                  {userType === "caregiver" && (
                    <button
                      type="button"
                      className="button-link"
                      onClick={() => handleRequestItem(item)}
                      disabled={
                        requestingIds.includes(item.id) ||
                        isAlreadyRequested(item.id)
                      }
                    >
                      {requestingIds.includes(item.id)
                        ? "Requesting..."
                        : isAlreadyRequested(item.id)
                          ? "Requested"
                          : "Request Item"}
                    </button>
                  )}
                </article>
              ))}
            </section>
          )}

          <h2>What we recommend</h2>
          {recommendedCategories.length > 0 && (
            <p className="recommendation-helper-label">
              Additional recommendations based on similar caregiver needs.
            </p>
          )}

          {recommendedItems.length === 0 ? (
            <p>No recommendations yet.</p>
          ) : (
            <section className="recommendations-list">
              {recommendedItems.map((item) => (
                <article key={item.id} className="recommendation-card">
                  <p className="recommendation-category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className="recommendation-why">
                    Why this is recommended: {formatReasons(item.reasons)}
                  </p>
                  {userType === "caregiver" && (
                    <button
                      type="button"
                      className="button-link"
                      onClick={() => handleRequestItem(item)}
                      disabled={
                        requestingIds.includes(item.id) ||
                        isAlreadyRequested(item.id)
                      }
                    >
                      {requestingIds.includes(item.id)
                        ? "Requesting..."
                        : isAlreadyRequested(item.id)
                          ? "Requested"
                          : "Request Item"}
                    </button>
                  )}
                </article>
              ))}
            </section>
          )}

          {requestFeedback && <p>{requestFeedback}</p>}
        </>
      )}

      <div className="button-row">
        {userType !== "caregiver" && (
          <Link className="button-link" to="/upload">
            Upload Item
          </Link>
        )}
      </div>

      {userType === "caregiver" ? (
        <section>
          <h2>Requested Items</h2>
          {requestedClaims.length === 0 ? (
            <p>No requested items yet.</p>
          ) : (
            <section className="recommendations-list">
              {requestedClaims.map((claim) => {
                const requestedItem = claim.itemId || {};
                const title =
                  requestedItem.title ||
                  requestedItem.itemName ||
                  requestedItem.text ||
                  "Requested item";
                return (
                  <article key={claim._id} className="recommendation-card">
                    <p className="recommendation-category">
                      {requestedItem.category || "Item"}
                    </p>
                    <h3>{title}</h3>
                    <p>
                      Request status:{" "}
                      {String(claim.status || "pending").replace("_", " ")}
                    </p>
                  </article>
                );
              })}
            </section>
          )}
        </section>
      ) : (
        <section>
          <h2>Your Items</h2>
          {donorItems.length === 0 ? (
            <p>No items yet. Upload your first donation!</p>
          ) : (
            <section className="recommendations-list">
              {donorItems.map((item) => (
                <article
                  key={String(item._id || item.id)}
                  className="recommendation-card"
                >
                  <p className="recommendation-category">{item.category || "Item"}</p>
                  <h3>{item.title || item.itemName || item.text || "Donated item"}</h3>
                  <p>{item.description || item.text || "No description provided."}</p>
                  <p>
                    {String(item.status || "") === "claimed"
                      ? "Successfully donated."
                      : "Waiting for caregiver request."}
                  </p>
                </article>
              ))}
            </section>
          )}
        </section>
      )}

    </main>
  );
}

export default DashboardPage;