import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./SettingsPage.css";
import LogoIcon from "../assets/website-icon.png";

function SettingsPage() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [notifications, setNotifications] = useState({
    recommendedItems: true,
    newRequests: true,
    donationUpdates: false,
    nearbyItems: true,
  });

  const [locationForm, setLocationForm] = useState({
    address: "",
    city: "",
    zip: "",
  });

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

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Save settings", { notifications, locationForm });
  };

  const handleCancel = () => {
    setLocationForm({
      address: "",
      city: "",
      zip: "",
    });
  };

  return (
    <main className="settings-page">
      <header className="settings-navbar">
        <div className="settings-logo-group">
          <img
            src={LogoIcon}
            className="settings-logo-icon"
            alt="Littleloop logo"
          />
        </div>

        <div className="settings-location">
          <span className="settings-location-label">Searching in</span>
          <strong>City, Zipcode</strong>
        </div>

        <div className="settings-search-wrap">
          <input
            className="settings-search"
            placeholder="Search Bar"
            aria-label="Search"
          />
        </div>

        <div className="settings-profile-wrap" ref={profileMenuRef}>
          <button
            className="settings-profile-trigger"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-label="Open profile menu"
            type="button"
          >
            <div className="settings-profile-avatar" />
          </button>

          {isProfileMenuOpen && (
            <div className="settings-profile-menu">
              <div className="settings-profile-menu-header">
                <div className="settings-profile-menu-avatar" />
                <div className="settings-profile-menu-user">
                  <strong>username</strong>
                  <span>Full Name</span>
                </div>
              </div>

              <div className="settings-profile-divider" />

              <div className="settings-profile-menu-links">
                <Link to="/profile" className="settings-profile-menu-link">
                  <span className="menu-icon-square" />
                  Profile
                </Link>

                <Link to="/dashboard" className="settings-profile-menu-link">
                  <span className="menu-icon-square" />
                  Donor Dashboard
                </Link>

                <Link to="/dashboard" className="settings-profile-menu-link">
                  <span className="menu-icon-square" />
                  Caregiver Dashboard
                </Link>
              </div>

              <div className="settings-profile-divider" />

              <div className="settings-profile-menu-links">
                <Link to="/settings" className="settings-profile-menu-link">
                  <span className="menu-icon-square" />
                  Settings
                </Link>
              </div>

              <div className="settings-profile-divider" />

              <Link
                to="/"
                onClick={handleLogout}
                className="settings-profile-menu-link"
              >
                <span className="menu-icon-square" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="settings-content">
        <h1 className="settings-title">Settings</h1>

        <section className="settings-block">
          <h2 className="settings-section-title">Notifications</h2>
          <p className="settings-helper-text">
            Choose which updates you’d like to receive.
          </p>

          <div className="settings-card">
            <div className="toggle-row">
              <div className="toggle-copy">
                <label>New recommended items</label>
                <p>Get notified when new items are recommended for your stage.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch ${
                  notifications.recommendedItems ? "active" : ""
                }`}
                onClick={() => handleToggle("recommendedItems")}
                aria-label="Toggle new recommended items"
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="toggle-row">
              <div className="toggle-copy">
                <label>New requests</label>
                <p>Get notified when request-related updates become available.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch ${
                  notifications.newRequests ? "active" : ""
                }`}
                onClick={() => handleToggle("newRequests")}
                aria-label="Toggle new requests"
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="toggle-row">
              <div className="toggle-copy">
                <label>Donation updates</label>
                <p>Receive updates about donations and item activity.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch ${
                  notifications.donationUpdates ? "active" : ""
                }`}
                onClick={() => handleToggle("donationUpdates")}
                aria-label="Toggle donation updates"
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="toggle-row toggle-row-last">
              <div className="toggle-copy">
                <label>Nearby item alerts</label>
                <p>Get notified when items are posted near your location.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch ${
                  notifications.nearbyItems ? "active" : ""
                }`}
                onClick={() => handleToggle("nearbyItems")}
                aria-label="Toggle nearby item alerts"
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>
        </section>

        <section className="settings-block">
          <h2 className="settings-section-title">Location</h2>
          <p className="settings-helper-text">
            Update your address so we can show nearby items and organizations.
          </p>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-field">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main Street"
                  value={locationForm.address}
                  onChange={handleLocationChange}
                />
              </div>
            </div>

            <div className="settings-row settings-row-two-col">
              <div className="settings-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Pomona"
                  value={locationForm.city}
                  onChange={handleLocationChange}
                />
              </div>

              <div className="settings-field">
                <label htmlFor="zip">Zip Code</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder="91768"
                  value={locationForm.zip}
                  onChange={handleLocationChange}
                />
              </div>
            </div>

            <div className="settings-actions">
              <button
                type="button"
                className="settings-btn settings-btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="settings-btn settings-btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default SettingsPage;