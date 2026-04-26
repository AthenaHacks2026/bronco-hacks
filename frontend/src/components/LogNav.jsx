import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/LogNav.css";
import LogoIcon from "../assets/website-icon.png";

function LogNav({
  locationLabel = "City, Zipcode",
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search Bar",
  profileName = {
    username: "username",
    fullName: "Full Name",
  },
  showDonorDashboard = true,
  showCaregiverDashboard = true,
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsProfileMenuOpen(false);
  };

  return (
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
        <strong>{locationLabel}</strong>
      </div>

      <div className="settings-search-wrap">
        <input
          className="settings-search"
          placeholder={searchPlaceholder}
          aria-label="Search"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
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
                <strong>{profileName.username}</strong>
                <span>{profileName.fullName}</span>
              </div>
            </div>

            <div className="settings-profile-divider" />

            <div className="settings-profile-menu-links">
              <Link
                to="/profile"
                className="settings-profile-menu-link"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <span className="menu-icon-square" />
                Profile
              </Link>

              {showDonorDashboard && (
                <Link
                  to="/dashboard"
                  className="settings-profile-menu-link"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <span className="menu-icon-square" />
                  Donor Dashboard
                </Link>
              )}

              {showCaregiverDashboard && (
                <Link
                  to="/dashboard"
                  className="settings-profile-menu-link"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <span className="menu-icon-square" />
                  Caregiver Dashboard
                </Link>
              )}
            </div>

            <div className="settings-profile-divider" />

            <div className="settings-profile-menu-links">
              <Link
                to="/settings"
                className="settings-profile-menu-link"
                onClick={() => setIsProfileMenuOpen(false)}
              >
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
  );
}

export default LogNav;