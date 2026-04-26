import logo from '../assets/website-icon.png'
import ProfileMenu from '../components/ProfileMenu'
import './ProfilePage.css'

function ProfilePage() {
  return (
    <main className="profile-page">
      <header className="profile-topbar">
        <div className="profile-topbar-left">
          <img src={logo} alt="LittleLoop logo" className="profile-topbar-logo" />
        </div>

        <div className="profile-topbar-search">Search Bar</div>

        <div className="profile-topbar-avatar" />
      </header>

      <section className="profile-layout">
        <div className="profile-main">
          <h1 className="profile-page-title">Profile</h1>

          <section className="profile-block">
            <h2 className="profile-block-title">Personal Info</h2>
            <p className="profile-block-subtitle">
              Update your photo and personal details here.
            </p>

            <div className="profile-form-card">
              <div className="profile-row two-columns">
                <div className="profile-field">
                  <label>First name</label>
                  <input type="text" placeholder="Jane" />
                </div>

                <div className="profile-field">
                  <label>Last name</label>
                  <input type="text" placeholder="Doe" />
                </div>
              </div>

              <div className="profile-field">
                <label>Username</label>
                <input type="text" placeholder="username.name" />
              </div>
            </div>
          </section>

          <section className="profile-block">
            <h2 className="profile-block-title">Caregiver Info</h2>
            <p className="profile-block-subtitle">
              Update your photo and personal details here.
            </p>

            <div className="profile-form-card">
              <div className="profile-field">
                <label>Situation</label>

                <div className="profile-row three-columns">
                  <input type="text" placeholder="Pregnant" />
                  <input type="text" placeholder="Postpartum" />
                  <input type="text" placeholder="Caring for infant" />
                </div>
              </div>

              <div className="profile-field">
                <label>Weeks / Child Age</label>
                <input type="text" placeholder="weeks / age of the child" />
              </div>
            </div>
          </section>

          <section className="profile-block">
            <h2 className="profile-block-title">Donor Info</h2>
            <p className="profile-block-subtitle">
              Update your photo and personal details here.
            </p>

            <div className="profile-form-card">
              <div className="profile-field">
                <label>Situation</label>

                <div className="profile-row three-columns">
                  <input type="text" placeholder="Location" />
                  <input type="text" placeholder="Street Address" />
                  <input type="text" placeholder="Phone" />
                </div>
              </div>

              <div className="profile-field">
                <label>Extra Info</label>
                <input type="text" placeholder="Any additional donor details" />
              </div>
            </div>
          </section>
        </div>

        <div className="profile-sidebar">
          <ProfileMenu />
        </div>
      </section>
    </main>
  )
}

export default ProfilePage