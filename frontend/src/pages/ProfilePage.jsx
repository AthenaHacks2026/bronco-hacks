import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./SettingsPage.css";
import LogoIcon from "../assets/website-icon.png";

function ProfilePage() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    caregiverSituation: "",
    caregiverStage: "",
    donorStatus: "",
    donorPreferences: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Save profile", profileForm);
  };

  const handleCancel = () => {
    setProfileForm({
      firstName: "",
      lastName: "",
      username: "",
      caregiverSituation: "",
      caregiverStage: "",
      donorStatus: "",
      donorPreferences: "",
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
        <h1 className="settings-title">Profile</h1>

        <section className="settings-block">
          <h2 className="settings-section-title">Personal Info</h2>
          <p className="settings-helper-text">
            Update your photo and personal details here.
          </p>

          <div className="settings-card">
            <div className="settings-row settings-row-two-col">
              <div className="settings-field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jane"
                  value={profileForm.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="settings-field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={profileForm.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username.name"
                  value={profileForm.username}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-block">
          <h2 className="settings-section-title">Caregiver Info</h2>
          <p className="settings-helper-text">
            Update your caregiving details and stage information.
          </p>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-field">
                <label htmlFor="caregiverSituation">Situation</label>
                <input
                  id="caregiverSituation"
                  name="caregiverSituation"
                  type="text"
                  placeholder="Pregnant / Postpartum / Caring for infant"
                  value={profileForm.caregiverSituation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label htmlFor="caregiverStage">Weeks / Child Age</label>
                <input
                  id="caregiverStage"
                  name="caregiverStage"
                  type="text"
                  placeholder="weeks / age of the child"
                  value={profileForm.caregiverStage}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-block">
          <h2 className="settings-section-title">Donor Info</h2>
          <p className="settings-helper-text">
            Update your donor preferences and participation details.
          </p>

          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-field">
                <label htmlFor="donorStatus">Donation Status</label>
                <input
                  id="donorStatus"
                  name="donorStatus"
                  type="text"
                  placeholder="Active donor / occasional donor"
                  value={profileForm.donorStatus}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label htmlFor="donorPreferences">Donation Preferences</label>
                <input
                  id="donorPreferences"
                  name="donorPreferences"
                  type="text"
                  placeholder="Clothing, toys, essentials"
                  value={profileForm.donorPreferences}
                  onChange={handleChange}
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

export default ProfilePage;