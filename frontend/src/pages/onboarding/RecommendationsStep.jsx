import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RecommendationsStep({ submitOnboarding }) {
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
      <h1>Onboarding: Recommendations</h1>
      <p>That is okay. We will recommend items to help you get started.</p>
      {message && <p>{message}</p>}
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/needs')}>
          Back
        </button>
        <button type="button" onClick={handleContinue} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Continue to Dashboard'}
        </button>
      </div>
    </main>
  )
}

export default RecommendationsStep
