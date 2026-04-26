import logo from '../assets/website-icon.png'
import ProfileMenu from '../components/ProfileMenu.jsx'
import './SettingsPage.css'

function SettingsPage() {
  return (
    <main className="settings-page">
      <header className="settings-topbar">
        <div className="settings-topbar-left">
          <img src={logo} alt="LittleLoop logo" className="settings-topbar-logo" />
        </div>

        <div className="settings-topbar-search">Search Bar</div>

        <div className="settings-topbar-avatar" />
      </header>

      <section className="settings-layout">
        <div className="settings-main">
          <h1 className="settings-page-title">Settings</h1>

          <section className="settings-block">
            <h2 className="settings-block-title">Notifications</h2>

            <div className="settings-form-card">
              <div className="settings-row">
                <div className="settings-field">
                  <label>First name</label>
                  <input type="text" placeholder="Jane" />
                </div>

                <div className="settings-field">
                  <label>Last name</label>
                  <input type="text" placeholder="Doe" />
                </div>
              </div>

              <div className="settings-field">
                <label>Username</label>
                <input type="text" placeholder="username.name" />
              </div>
            </div>
          </section>

          <section className="settings-block">
            <h2 className="settings-block-title">Location</h2>
            <p className="settings-block-subtitle">
              Update your photo and personal details here.
            </p>

            <div className="settings-form-card">
              <div className="settings-field">
                <label>Location</label>
                <input type="text" placeholder="Location" />
              </div>
            </div>
          </section>
        </div>

        <div className="settings-sidebar">
          <ProfileMenu />
        </div>
      </section>
    </main>
  )
}

export default SettingsPage