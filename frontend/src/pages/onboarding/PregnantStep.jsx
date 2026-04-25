import { useNavigate } from 'react-router-dom'

function PregnantStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.pregnantWeeks)

  return (
    <main className="page">
      <h1>Onboarding: Pregnant</h1>
      <label htmlFor="pregnant-weeks">How many weeks along in pregnancy are you?</label>
      <input
        id="pregnant-weeks"
        type="number"
        min="1"
        value={onboarding.pregnantWeeks}
        onChange={(event) => setOnboarding((prev) => ({ ...prev, pregnantWeeks: event.target.value }))}
      />
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/caregiver-info')}>
          Back
        </button>
        {canContinue && (
          <button type="button" onClick={() => navigate('/onboarding/needs')}>
            Continue
          </button>
        )}
      </div>
    </main>
  )
}

export default PregnantStep
