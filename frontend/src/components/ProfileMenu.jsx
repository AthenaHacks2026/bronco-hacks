import { Link, useNavigate } from 'react-router-dom'
import './ProfileMenu.css'

function ProfileMenu() {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  return (
    <aside className="profile-menu-card">
      <div className="profile-menu-header">
        <div className="profile-menu-avatar" />

        <div className="profile-menu-user-info">
          <h2 className="profile-menu-username">solaresmichelle22</h2>
          <p className="profile-menu-fullname">Full Name</p>
        </div>
      </div>

      <div className="profile-menu-divider" />

      <nav className="profile-menu-nav">
        <Link to="/profile" className="profile-menu-link">
          <span className="profile-menu-icon" />
          <span>Profile</span>
        </Link>

        <Link to="/dashboard" className="profile-menu-button">
          <span className="profile-menu-icon" />
          <span>Donor Dashboard</span>
        </Link>

        <Link to="/dashboard" className="profile-menu-button">
          <span className="profile-menu-icon" />
          <span>Caregiver Dashboard</span>
        </Link>
      </nav>

      <div className="profile-menu-divider" />

      <nav className="profile-menu-nav">
        <Link to="/settings" className="profile-menu-link">
          <span className="profile-menu-icon" />
          <span>Settings</span>
        </Link>

        <button type="button" className="profile-menu-link profile-menu-plain-button">
          <span className="profile-menu-icon" />
          <span>Appearance</span>
        </button>
      </nav>

      <div className="profile-menu-divider" />

      <button
        type="button"
        className="profile-menu-link profile-menu-plain-button profile-menu-signout"
        onClick={handleSignOut}
      >
        <span className="profile-menu-icon" />
        <span>Sign Out</span>
      </button>
    </aside>
  )
}

export default ProfileMenu