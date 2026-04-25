import { useNavigate } from 'react-router-dom'

function RecommendationsStep() {
  const navigate = useNavigate()

  return (
    <main className="page">
      <h1>Onboarding: Recommendations</h1>
      <p>That is okay. We will recommend items to help you get started.</p>
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/needs')}>
          Back
        </button>
        <button type="button" onClick={() => navigate('/dashboard')}>
          Continue to Dashboard
        </button>
      </div>
    </main>
  )
}

export default RecommendationsStep
