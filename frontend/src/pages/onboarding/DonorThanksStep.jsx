import { useNavigate } from 'react-router-dom'

function DonorThanksStep() {
  const navigate = useNavigate()

  return (
    <main className="page">
      <h1>Thank You</h1>
      <p>We are grateful you are taking the time to donate and support families in need. Continue to the dashboard to make your first donation!</p>
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/donor-info')}>
          Back
        </button>
        <button type="button" onClick={() => navigate('/dashboard')}>
          Continue
        </button>
      </div>
    </main>
  )
}

export default DonorThanksStep
