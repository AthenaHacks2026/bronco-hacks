import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./DashboardPage.css";

import LogoIcon from "../assets/website-icon.png";

function DashboardPage() {
  const [lookingForItems, setLookingForItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  const [donorItems, setDonorItems] = useState([]);

  const [userRoles, setUserRoles] = useState({
    isCaregiver: false,
    isDonor: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState("City, Zipcode");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState({});
  const [profileName, setProfileName] = useState({
    username: "username",
    fullName: "Full Name",
  });

  const profileMenuRef = useRef(null);

  function getFallbackCategories(onboarding) {
    const situation = String(onboarding?.situation || "").toLowerCase();
    const weeksPregnant = Number(
      onboarding?.weeksPregnant ??
        onboarding?.pregnancyWeeks ??
        onboarding?.weeks ??
        0
    );
    const weeksPostpartum = Number(
      onboarding?.weeksPostpartum ?? onboarding?.postpartumWeeks ?? 0
    );
    const childAgeMonths = Number(
      onboarding?.childAgeMonths ?? onboarding?.childAge ?? 0
    );

    if (situation === "pregnant") {
      if (weeksPregnant >= 28) {
        return ["Clothing", "Feeding", "Hospital Prep"];
      }
      return ["Clothing", "Essentials"];
    }

    if (situation === "postpartum") {
      if (weeksPostpartum <= 8) {
        return ["Feeding", "Recovery", "Clothing"];
      }
      return ["Clothing", "Feeding", "Essentials"];
    }

    if (childAgeMonths > 0 && childAgeMonths <= 12) {
      return ["Clothing", "Toys", "Feeding"];
    }

    return ["Clothing", "Toys", "Essentials"];
  }

  function getStageSummary(onboarding) {
    const situation = String(onboarding?.situation || "").toLowerCase();
    const weeksPregnant = Number(
      onboarding?.weeksPregnant ??
        onboarding?.pregnancyWeeks ??
        onboarding?.weeks ??
        0
    );
    const weeksPostpartum = Number(
      onboarding?.weeksPostpartum ?? onboarding?.postpartumWeeks ?? 0
    );
    const childAgeMonths = Number(
      onboarding?.childAgeMonths ?? onboarding?.childAge ?? 0
    );

    if (situation === "pregnant") {
      if (weeksPregnant >= 28) {
        return "As you approach delivery, these items can help you prepare for both your hospital stay and postpartum recovery. We’ve highlighted essentials commonly needed at this stage.";
      }
      return "These recommendations focus on early pregnancy essentials and items caregivers commonly need during this stage.";
    }

    if (situation === "postpartum") {
      if (weeksPostpartum <= 8) {
        return "These recommendations support recovery, feeding, and early newborn care during the postpartum stage.";
      }
      return "These recommendations focus on daily essentials commonly needed after the early postpartum period.";
    }

    if (childAgeMonths > 0 && childAgeMonths <= 12) {
      return "As your child grows, these recommendations focus on clothing, play, and everyday essentials for this stage.";
    }

    return "Based on your current stage, we’ve selected categories and items that may be most helpful right now.";
  }

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
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const meRes = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = meRes.data?.user || {};
        const onboarding = user?.onboarding || {};
        setOnboardingData(onboarding);

        const rawUserType = String(onboarding?.userType || "").toLowerCase();
        const isCaregiver =
          rawUserType === "caregiver" || rawUserType === "both";
        const isDonor = rawUserType === "donor" || rawUserType === "both";

        setUserRoles({ isCaregiver, isDonor });

        const city = user?.location?.city || user?.city || "City";
        const zip = user?.location?.zip || user?.zipCode || "Zipcode";
        setLocationLabel(`${city}, ${zip}`);

        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";
        const username = user?.username || "username";
        const fullName =
          [firstName, lastName].filter(Boolean).join(" ") || "Full Name";

        setProfileName({
          username,
          fullName,
        });

        if (isDonor && !isCaregiver) {
          const itemsRes = await axios.get("/api/items");
          const allItems = itemsRes.data || [];
          const currentUserId = String(user?._id || "");

          const ownedItems = allItems.filter((item) => {
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
          setLookingForItems([]);
          setRecommendedItems([]);
          setRecommendedCategories([]);
          return;
        }

        const recRes = await axios.get("/api/recommendations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lookingFor = recRes.data?.lookingFor?.items || [];
        const recommended = recRes.data?.recommended?.items || [];
        const apiCategories = recRes.data?.recommended?.categories || [];
        const fallbackCategories = getFallbackCategories(onboarding);

        setLookingForItems(lookingFor);
        setRecommendedItems(recommended);
        setRecommendedCategories(
          apiCategories.length > 0 ? apiCategories : fallbackCategories
        );

        if (isDonor) {
          const itemsRes = await axios.get("/api/items");
          const allItems = itemsRes.data || [];
          const currentUserId = String(user?._id || "");

          const ownedItems = allItems.filter((item) => {
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

  const showDonorDashboard = userRoles.isDonor && !userRoles.isCaregiver;
  const showCaregiverDashboard = userRoles.isCaregiver;

  return (
    <main className="dashboard-page">
      <header className="dashboard-navbar">
        <div className="dashboard-logo-group">
          <img
            src={LogoIcon}
            alt="Littleloop logo"
            className="dashboard-logo-icon"
          />
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
            <div className="dashboard-profile-avatar" />
          </button>

          {isProfileMenuOpen && (
            <div className="dashboard-profile-menu">
              <div className="dashboard-profile-menu-header">
                <div className="dashboard-profile-menu-avatar" />
                <div className="dashboard-profile-menu-user">
                  <strong>{profileName.username}</strong>
                  <span>{profileName.fullName}</span>
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

                {userRoles.isDonor && (
                  <Link
                    to="/dashboard"
                    className="dashboard-profile-menu-link"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <span className="menu-icon-square" />
                    Donor Dashboard
                  </Link>
                )}

                {userRoles.isCaregiver && (
                  <Link
                    to="/dashboard"
                    className="dashboard-profile-menu-link"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <span className="menu-icon-square" />
                    Caregiver Dashboard
                  </Link>
                )}
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
        {showDonorDashboard ? (
          <>
            <section className="donor-header-section">
              <div className="donor-header-row">
                <div className="donor-title-block">
                  <h1>Your Donations</h1>
                  <p className="dashboard-subtext">
                    Items that are active or have been donated in the past.
                  </p>
                </div>

                <Link
                  to="/upload"
                  className="dashboard-add-button"
                  aria-label="Add donation"
                >
                  +
                </Link>
              </div>
            </section>

            {donorItems.length === 0 ? (
              <section className="donor-empty-state">
                <h3>No donations yet</h3>
                <p>Upload your first item to start helping families in your area.</p>
                <Link to="/upload" className="dashboard-primary-btn">
                  Add Item
                </Link>
              </section>
            ) : (
              <section className="donor-cards-grid">
                {donorItems.map((item) => (
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
                        <li>Donated by User</li>
                        <li>{item?.city || "Pomona"} • #{item?.miles || "miles"}</li>
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
        ) : showCaregiverDashboard ? (
          <>
            <section className="caregiver-header">
              <h1>Recommended for your stage</h1>
              <p className="dashboard-subtext">
                {getStageSummary(onboardingData)}
              </p>
            </section>

            {searchQuery.trim() && (
              <section className="dashboard-section">
                <h2>Search Results</h2>

                {filteredLookingForItems.length === 0 ? (
                  <p className="dashboard-empty-text">No results found.</p>
                ) : (
                  <div className="dashboard-item-grid">
                    {filteredLookingForItems.map((item) => (
                      <article key={item.id} className="dashboard-item-card">
                        <img
                          src={item.image || "https://via.placeholder.com/120"}
                          alt={item.title}
                          className="dashboard-item-image"
                        />

                        <div className="dashboard-item-body">
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>

                          <button className="dashboard-secondary-btn">
                            Request Item →
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="dashboard-section">
              <h2>Recommended Categories</h2>

              {recommendedCategories.length === 0 ? (
                <p className="dashboard-empty-text">No categories yet.</p>
              ) : (
                <div className="category-card-grid">
                  {recommendedCategories.map((category, index) => {
                    const previewItems = recommendedItems
                      .filter((item) => {
                        const itemCategory = String(item?.category || "").toLowerCase();
                        const currentCategory = String(category || "").toLowerCase();

                        return (
                          itemCategory.includes(currentCategory) ||
                          currentCategory.includes(itemCategory)
                        );
                      })
                      .slice(0, 4);

                    return (
                      <div key={`${category}-${index}`} className="category-preview-card">
                        <h3>{category}</h3>

                        <div className="category-preview-grid">
                          {previewItems.length > 0 ? (
                            previewItems.map((item) => (
                              <img
                                key={item.id}
                                src={item.image || "https://via.placeholder.com/80"}
                                alt={item.title}
                                className="category-preview-tile"
                              />
                            ))
                          ) : (
                            <>
                              <div className="category-preview-tile" />
                              <div className="category-preview-tile" />
                              <div className="category-preview-tile" />
                              <div className="category-preview-tile" />
                            </>
                          )}
                        </div>

                        <button className="category-view-btn">
                          View Items →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="dashboard-section">
              <h2>Additional Recommendations</h2>

              {filteredRecommendedItems.length === 0 ? (
                <p className="dashboard-empty-text">No recommendations yet.</p>
              ) : (
                <div className="dashboard-item-grid">
                  {filteredRecommendedItems.map((item) => (
                    <article key={item.id} className="dashboard-item-card">
                      <img
                        src={item.image || "https://via.placeholder.com/120"}
                        alt={item.title}
                        className="dashboard-item-image"
                      />

                      <div className="dashboard-item-body">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>

                        <button className="dashboard-secondary-btn">
                          Request Item →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="dashboard-section">
            <h2>No dashboard available</h2>
            <p className="dashboard-empty-text">
              Your account does not currently have a caregiver or donor role.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;