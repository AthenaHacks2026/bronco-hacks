import { Link } from 'react-router-dom'

function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem('token')
  }

  return (
    <main className="page">
      <h1>Welcome</h1>
      <p>This is your dashboard page.</p>
      <div className="button-row">
        <Link className="button-link" to="/settings">Settings</Link>
      </div>
      <p>
        <Link to="/" onClick={handleLogout}>
          Logout
        </Link>
      </p>
    </main>
  )
}

export default DashboardPage
