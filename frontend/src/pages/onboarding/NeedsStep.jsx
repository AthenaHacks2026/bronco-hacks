import { useNavigate } from 'react-router-dom'

function NeedsStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.needsConfidence)

  const handleBack = () => {
    if (onboarding.userType === 'donor') {
      navigate('/onboarding/donor-info')
      return
    }
    if (onboarding.userType === 'caregiver' || onboarding.userType === 'both') {
      navigate(`/onboarding/${onboarding.caregiverType || 'caregiver-info'}`)
      return
    }
    navigate('/onboarding/user-type')
  }

  const handleContinue = () => {
    if (!canContinue) return
    if (onboarding.needsConfidence === 'know') {
      navigate('/onboarding/needs-tags')
      return
    }
    navigate('/onboarding/recommendations')
  }

  return (
    <main className="page">
      <h1>Onboarding: Needs</h1>
      <p>Which statement fits you right now?</p>
      <div className="form">
        <label>
          <input
            type="radio"
            name="needsConfidence"
            checked={onboarding.needsConfidence === 'know'}
            onChange={() => setOnboarding((prev) => ({ ...prev, needsConfidence: 'know' }))}
          />
          I know what I need
        </label>
        <label>
          <input
            type="radio"
            name="needsConfidence"
            checked={onboarding.needsConfidence === 'unsure'}
            onChange={() => setOnboarding((prev) => ({ ...prev, needsConfidence: 'unsure' }))}
          />
          I am not sure yet
        </label>
      </div>
      <div className="button-row">
        <button type="button" onClick={handleBack}>
          Back
        </button>
        {canContinue && (
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
        )}
      </div>
    </main>
  )
}

export default NeedsStep
