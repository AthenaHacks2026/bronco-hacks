import { useNavigate } from 'react-router-dom'

function UserTypeStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.userType)

  const handleContinue = () => {
    if (!canContinue) return
    if (onboarding.userType === 'donor' || onboarding.userType === 'both') {
      navigate('/onboarding/donor-info')
      return
    }
    navigate('/onboarding/caregiver-info')
  }

  return (
    <main className="page">
      <h1>Onboarding: User Type</h1>
      <p>Choose the option that best describes you.</p>
      <div className="form">
        <label>
          <input
            type="radio"
            name="userType"
            checked={onboarding.userType === 'caregiver'}
            onChange={() => setOnboarding((prev) => ({ ...prev, userType: 'caregiver' }))}
          />
          Caregiver
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            checked={onboarding.userType === 'donor'}
            onChange={() => setOnboarding((prev) => ({ ...prev, userType: 'donor' }))}
          />
          Donor
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            checked={onboarding.userType === 'both'}
            onChange={() => setOnboarding((prev) => ({ ...prev, userType: 'both' }))}
          />
          Both
        </label>
      </div>
      <div className="button-row">
        <button type="button" onClick={() => navigate('/signup')}>
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

export default UserTypeStep
