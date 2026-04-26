import { useNavigate } from 'react-router-dom'
import '../../styles/DonorThanksStep.css'

function DonorThanksStep() {
  const navigate = useNavigate()

  return (
    <main className="thanks-page">
      <div className="thanks-logo">LittleLoop</div>

      <section className="thanks-container">
        <div className="thanks-card">
          <h1 className="thanks-title">Thank You</h1>

          <p className="thanks-text">
            We appreciate you taking the time to donate and support families in need.
          </p>

          <p className="thanks-subtext">
            Continue to the dashboard to make your first donation.
          </p>

          <div className="thanks-actions">
            <button
              type="button"
              className="thanks-back"
              onClick={() => navigate('/onboarding/donor-info')}
            >
              Back
            </button>

            <button
              type="button"
              className="thanks-continue"
              onClick={() => navigate('/dashboard')}
            >
              Continue →
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DonorThanksStep