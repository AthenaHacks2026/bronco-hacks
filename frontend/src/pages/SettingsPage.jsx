import { useState } from "react";
import "./SettingsPage.css";
import LogNav from "../components/LogNav";

function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
      <LogNav
        locationLabel="City, Zipcode"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search Bar"
        profileName={{
          username: "username",
          fullName: "Full Name",
        }}
        showDonorDashboard={true}
        showCaregiverDashboard={true}
      />

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