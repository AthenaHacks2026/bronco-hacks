import { useNavigate } from 'react-router-dom'

function OtherStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.childAgeValue && onboarding.childAgeUnit)

  return (
    <main className="page">
      <h1>Onboarding: Other</h1>
      <label htmlFor="child-age-value">How old is the child?</label>
      <input
        id="child-age-value"
        type="number"
        min="0"
        value={onboarding.childAgeValue}
        onChange={(event) => setOnboarding((prev) => ({ ...prev, childAgeValue: event.target.value }))}
      />
      <div className="form">
        <label>
          <input
            type="radio"
            name="childAgeUnit"
            checked={onboarding.childAgeUnit === 'weeks'}
            onChange={() => setOnboarding((prev) => ({ ...prev, childAgeUnit: 'weeks' }))}
          />
          Weeks
        </label>
        <label>
          <input
            type="radio"
            name="childAgeUnit"
            checked={onboarding.childAgeUnit === 'years'}
            onChange={() => setOnboarding((prev) => ({ ...prev, childAgeUnit: 'years' }))}
          />
          Years
        </label>
      </div>
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

export default OtherStep
