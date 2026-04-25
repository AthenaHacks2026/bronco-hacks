import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="page">
      <h1>Website Name!</h1>
      <p>Choose an option below.</p>
      <div className="button-row">
        <Link className="button-link" to="/login">
          Login
        </Link>
        <Link className="button-link" to="/signup">
          Sign Up
        </Link>
      </div>
    </main>
  )
}

export default LandingPage
