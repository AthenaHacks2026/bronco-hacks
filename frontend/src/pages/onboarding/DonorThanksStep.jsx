import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './DonorThanksStep.css'

function DonorThanksStep({ submitOnboarding }) {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleContinue = async () => {
    if (isSaving) return

    setIsSaving(true)
    setMessage('')

    const result = await submitOnboarding()

    if (result.ok) {
      navigate('/dashboard')
    } else {
      setMessage(result.message || 'Failed to save onboarding.')
    }

    setIsSaving(false)
  }

  return (
    <main className="donor-thanks-page">
      <div className="donor-thanks-card">
        <h1 className="donor-thanks-title">Thank You</h1>

        <p className="donor-thanks-text">
          We appreciate you taking the time to donate and support families in need.
        </p>

        <p className="donor-thanks-subtext">
          Continue to the dashboard to make your first donation.
        </p>

        {message && <p className="donor-thanks-message">{message}</p>}

        <div className="donor-thanks-buttons">
          <button
            type="button"
            className="donor-back-button"
            onClick={() => navigate('/onboarding/donor-info')}
          >
            Back
          </button>

          <button
            type="button"
            className="donor-continue-button"
            onClick={handleContinue}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Continue →'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default DonorThanksStep