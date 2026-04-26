import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./DashboardPage.css";

import LogoIcon from "../assets/website-icon.png";

const formatReasons = (reasons = []) => {
  if (!reasons.length) return "Matched to your profile and current stage.";
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
  const [viewMode, setViewMode] = useState("caregiver");
  const [normalizedNeeds, setNormalizedNeeds] = useState([]);
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  const [requestingIds, setRequestingIds] = useState([]);
  const [requestedItemIds, setRequestedItemIds] = useState([]);
  const [requestFeedback, setRequestFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState("City, Zipcode");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const meRes = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = meRes.data?.user || {};
        setCurrentUser(user);

        const currentUserType = user?.onboarding?.userType || "caregiver";
        setUserType(currentUserType);
        setViewMode(currentUserType);

        const city = user?.location?.city || user?.city || "";
        const zip = user?.location?.zip || user?.zipCode || "";
        const formattedLocation =
          [city, zip].filter(Boolean).join(", ") || "City, Zipcode";
        setLocationLabel(formattedLocation);

        const currentUserId = String(user?._id || "");

        try {
          const allItemsRes = await axios.get("/api/items");
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
        } catch (err) {
          console.error("Donor items fetch failed:", err);
          setDonorItems([]);
        }

        try {
          const recRes = await axios.get("/api/recommendations", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setNormalizedNeeds(recRes.data?.normalizedNeeds || []);
          setRecommendedCategories(recRes.data?.recommended?.categories || []);
          setLookingForItems(recRes.data?.lookingFor?.items || []);
          setRecommendedItems(recRes.data?.recommended?.items || []);
        } catch (err) {
          console.error("Recommendations fetch failed:", err);
          setNormalizedNeeds([]);
          setRecommendedCategories([]);
          setLookingForItems([]);
          setRecommendedItems([]);
        }

        try {
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
          console.error("Claims fetch failed:", err);
          setRequestedClaims([]);
          setRequestedItemIds([]);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const isAlreadyRequested = (itemId) =>
    requestedItemIds.includes(String(itemId)) ||
    requestedClaims.some(
      (claim) =>
        String(claim?.itemId?._id || claim?.itemId) === String(itemId) &&
        ["pending", "accepted", "completed"].includes(String(claim?.status || ""))
    );

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

      setRecommendedItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
      setLookingForItems((prev) => prev.filter((candidate) => candidate.id !== item.id));
      setRequestFeedback("Item requested successfully.");
    } catch (error) {
      if (error?.response?.status === 409) {
        setRequestFeedback(
          error?.response?.data?.message || "You already requested this item."
        );
      } else {
        setRequestFeedback(
          error?.response?.data?.message || "Failed to submit item request."
        );
      }
    } finally {
      setRequestingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const filteredLookingForItems = useMemo(() => {
    if (!searchQuery.trim()) return lookingForItems;
    const q = searchQuery.toLowerCase();
    return lookingForItems.filter((item) =>
      [item?.title, item?.description, item?.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [lookingForItems, searchQuery]);

  const filteredRecommendedItems = useMemo(() => {
    if (!searchQuery.trim()) return recommendedItems;
    const q = searchQuery.toLowerCase();
    return recommendedItems.filter((item) =>
      [item?.title, item?.description, item?.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [recommendedItems, searchQuery]);

  const filteredDonorItems = useMemo(() => {
    if (!searchQuery.trim()) return donorItems;
    const q = searchQuery.toLowerCase();
    return donorItems.filter((item) =>
      [
        item?.title,
        item?.itemName,
        item?.text,
        item?.description,
        item?.category,
        item?.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [donorItems, searchQuery]);

  const fullName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ");
  const username =
    currentUser?.username || currentUser?.email?.split("@")?.[0] || "username";

  return (
    <main className="dashboard-page">
      <header className="dashboard-navbar">
        <div className="dashboard-logo-group">
          <img src={LogoIcon} alt="Littleloop logo" className="dashboard-logo-icon" />
        </div>

        <div className="dashboard-location">
          <span className="dashboard-location-label">Searching in</span>
          <strong>{locationLabel}</strong>
        </div>

        <div className="dashboard-search-wrap">
          <input
            type="text"
            placeholder="Search for clothes, bottles, toys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-search"
          />
        </div>

        <div className="dashboard-profile-wrap" ref={profileMenuRef}>
          <button
            type="button"
            className="dashboard-profile-trigger"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-label="Open profile menu"
          >
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt="Profile"
                className="dashboard-profile-avatar-img"
              />
            ) : (
              <div className="dashboard-profile-avatar" />
            )}
          </button>

          {isProfileMenuOpen && (
            <div className="dashboard-profile-menu">
              <div className="dashboard-profile-menu-header">
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt="Profile"
                    className="dashboard-profile-menu-avatar-img"
                  />
                ) : (
                  <div className="dashboard-profile-menu-avatar" />
                )}

                <div className="dashboard-profile-menu-user">
                  <strong>{username}</strong>
                  <span>{fullName || "Full Name"}</span>
                </div>
              </div>

              <div className="dashboard-profile-divider" />

              <div className="dashboard-profile-menu-links">
                <Link
                  to="/profile"
                  className="dashboard-profile-menu-link"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <span className="menu-icon-square" />
                  Profile
                </Link>

                <button
                  type="button"
                  className="dashboard-profile-menu-link menu-button"
                  onClick={() => {
                    setViewMode("donor");
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <span className="menu-icon-square" />
                  Donor Dashboard
                </button>

                <button
                  type="button"
                  className="dashboard-profile-menu-link menu-button"
                  onClick={() => {
                    setViewMode("caregiver");
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <span className="menu-icon-square" />
                  Caregiver Dashboard
                </button>
              </div>

              <div className="dashboard-profile-divider" />

              <div className="dashboard-profile-menu-links">
                <Link
                  to="/settings"
                  className="dashboard-profile-menu-link"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <span className="menu-icon-square" />
                  Settings
                </Link>

                <Link
                  to="/appearance"
                  className="dashboard-profile-menu-link"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <span className="menu-icon-square" />
                  Appearance
                </Link>
              </div>

              <div className="dashboard-profile-divider" />

              <Link
                to="/"
                onClick={() => {
                  handleLogout();
                  setIsProfileMenuOpen(false);
                }}
                className="dashboard-profile-menu-link"
              >
                <span className="menu-icon-square" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="dashboard-content">
        {viewMode === "donor" ? (
          <>
            <section className="donor-header-section">
              <div className="donor-header-row">
                <div className="donor-title-block">
                  <h1>Your Donations</h1>
                  <p className="dashboard-subtext">
                    Items that are active or have been donated in the past.
                  </p>
                </div>

                <Link to="/upload" className="dashboard-add-button" aria-label="Add donation">
                  +
                </Link>
              </div>
            </section>

            {filteredDonorItems.length === 0 ? (
              <section className="donor-empty-state">
                <h3>No donations yet</h3>
                <p>Upload your first item to start helping families in your area.</p>
                <Link to="/upload" className="dashboard-primary-btn">
                  Add Item
                </Link>
              </section>
            ) : (
              <section className="donor-cards-grid">
                {filteredDonorItems.map((item) => (
                  <article
                    key={String(item._id || item.id)}
                    className="donation-item-card"
                  >
                    <img
                      src={
                        item?.imageUrl ||
                        item?.photoUrl ||
                        item?.image ||
                        "https://via.placeholder.com/180x140?text=Item"
                      }
                      alt={item?.title || "Donation"}
                      className="donation-item-image"
                    />

                    <div className="donation-item-body">
                      <h3>{item?.title || item?.itemName || item?.text || "Donated item"}</h3>

                      <ul className="donation-item-meta">
                        <li>{item?.category || "Category"}</li>
                        <li>Donated by me</li>
                        <li>{item?.city || "Pomona"}</li>
                        <li>
                          {item?.createdAt
                            ? `Posted ${new Date(item.createdAt).toLocaleDateString()}`
                            : "Posted recently"}
                        </li>
                      </ul>

                      <button type="button" className="donation-item-action">
                        View Item →
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        ) : (
          <>
            <section className="caregiver-header-section">
              <div className="caregiver-title-block">
                <h1>Recommended for your stage</h1>
                <p className="dashboard-subtext">
                  Based on your current stage, we’ve selected categories and items
                  that may be most helpful right now.
                </p>
              </div>
            </section>

            {searchQuery.trim() && (
              <section className="dashboard-section">
                <div className="section-heading-row">
                  <h2>Search Results</h2>
                  <span className="section-helper">Results for “{searchQuery}”</span>
                </div>

                {filteredLookingForItems.length === 0 ? (
                  <p className="dashboard-empty-text">No direct matches found yet.</p>
                ) : (
                  <div className="dashboard-item-grid">
                    {filteredLookingForItems.map((item) => (
                      <article key={item.id} className="dashboard-item-card">
                        <div className="dashboard-item-top">
                          <span className="dashboard-item-category">{item.category}</span>
                        </div>

                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p className="dashboard-item-why">{formatReasons(item.reasons)}</p>

                        <button
                          type="button"
                          className="dashboard-secondary-btn"
                          onClick={() => handleRequestItem(item)}
                          disabled={
                            requestingIds.includes(item.id) || isAlreadyRequested(item.id)
                          }
                        >
                          {requestingIds.includes(item.id)
                            ? "Requesting..."
                            : isAlreadyRequested(item.id)
                              ? "Requested"
                              : "Request Item"}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="dashboard-section">
              <div className="section-heading-row">
                <h2>Recommended Categories</h2>
                <span className="section-helper">
                  Tailored to your stage and caregiving needs
                </span>
              </div>

              {recommendedCategories.length === 0 ? (
                <p className="dashboard-empty-text">No categories yet.</p>
              ) : (
                <div className="category-card-grid">
                  {recommendedCategories.map((category, index) => {
                    const previewItems = recommendedItems
                      .filter(
                        (item) =>
                          String(item?.category || "").toLowerCase() ===
                          String(category || "").toLowerCase()
                      )
                      .slice(0, 4);

                    return (
                      <article key={`${category}-${index}`} className="category-preview-card">
                        <div className="category-preview-header">
                          <div className="category-preview-icon">⬡</div>
                          <h3>{category}</h3>
                        </div>

                        <div className="category-preview-grid">
                          {previewItems.length > 0 ? (
                            previewItems.map((item) => (
                              <div key={item.id} className="category-preview-tile">
                                {item.title}
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="category-preview-tile muted">Suggested item</div>
                              <div className="category-preview-tile muted">Suggested item</div>
                              <div className="category-preview-tile muted">Suggested item</div>
                              <div className="category-preview-tile muted">Suggested item</div>
                            </>
                          )}
                        </div>

                        <button type="button" className="category-view-btn">
                          View Items →
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="dashboard-section">
              <div className="section-heading-row">
                <h2>Additional Recommendations</h2>
                <span className="section-helper">
                  What other caregivers in similar situations found useful
                </span>
              </div>

              {filteredRecommendedItems.length === 0 ? (
                <p className="dashboard-empty-text">No recommendations yet.</p>
              ) : (
                <div className="dashboard-item-grid">
                  {filteredRecommendedItems.map((item) => (
                    <article key={item.id} className="dashboard-item-card">
                      <div className="dashboard-item-top">
                        <span className="dashboard-item-category">{item.category}</span>
                      </div>

                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p className="dashboard-item-why">{formatReasons(item.reasons)}</p>

                      <button
                        type="button"
                        className="dashboard-secondary-btn"
                        onClick={() => handleRequestItem(item)}
                        disabled={
                          requestingIds.includes(item.id) || isAlreadyRequested(item.id)
                        }
                      >
                        {requestingIds.includes(item.id)
                          ? "Requesting..."
                          : isAlreadyRequested(item.id)
                            ? "Requested"
                            : "Request Item"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-request-box">
              <h3>Can’t find what you need?</h3>
              <p>Create a request and we’ll notify you when someone donates it.</p>
              <Link to="/request" className="dashboard-primary-btn">
                Create a Request
              </Link>
            </section>

            {requestFeedback && <p className="dashboard-feedback">{requestFeedback}</p>}

            <section className="dashboard-section">
              <div className="section-heading-row">
                <h2>Requested Items</h2>
              </div>

              {requestedClaims.length === 0 ? (
                <p className="dashboard-empty-text">No requested items yet.</p>
              ) : (
                <div className="dashboard-item-grid">
                  {requestedClaims.map((claim) => {
                    const requestedItem = claim.itemId || {};
                    const title =
                      requestedItem.title ||
                      requestedItem.itemName ||
                      requestedItem.text ||
                      "Requested item";

                    return (
                      <article key={claim._id} className="dashboard-item-card">
                        <div className="dashboard-item-top">
                          <span className="dashboard-item-category">
                            {requestedItem.category || "Item"}
                          </span>
                        </div>

                        <h3>{title}</h3>
                        <p>
                          Request status:{" "}
                          {String(claim.status || "pending").replace("_", " ")}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;