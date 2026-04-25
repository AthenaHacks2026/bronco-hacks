import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <main className="page">
      <h1>Thank You</h1>
      <p>We are grateful you are taking the time to donate and support families in need. Continue to the dashboard to make your first donation!</p>
      {message && <p>{message}</p>}
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/donor-info')}>
          Back
        </button>
        <button type="button" onClick={handleContinue} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </main>
  )
}

export default DonorThanksStep
