import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const formatReasons = (reasons = []) => {
  if (!reasons.length) return 'Matched to your profile and recent onboarding info.'
  return reasons
    .map((reason) => reason.charAt(0).toUpperCase() + reason.slice(1))
    .join(' • ')
}

function DashboardPage() {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get('/api/recommendations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setRecommendations(res.data.recommendations || [])
      } catch (err) {
        console.error('Recommendations fetch failed:', err)
        setRecommendations([])
      }
    }

    fetchRecommendations()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
  }

  return (
    <main className="page">
      <h1>Welcome</h1>
      <p>This is your dashboard page.</p>

      <h2>Recommended for you</h2>
      {recommendations.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <section className="recommendations-list">
          {recommendations.map((item) => (
            <article key={item.id} className="recommendation-card">
              <p className="recommendation-category">{item.category}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="recommendation-why">
                Why this is recommended: {formatReasons(item.reasons)}
              </p>
            </article>
          ))}
        </section>
      )}

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
