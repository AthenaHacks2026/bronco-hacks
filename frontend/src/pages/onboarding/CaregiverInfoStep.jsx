import { useNavigate } from 'react-router-dom'

function CaregiverInfoStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.caregiverType)

  const handleContinue = () => {
    if (!canContinue) return
    navigate(`/onboarding/${onboarding.caregiverType}`)
  }

  const handleBack = () => {
    if (onboarding.userType === 'both') {
      navigate('/onboarding/donor-info')
      return
    }
    navigate('/onboarding/user-type')
  }

  return (
    <main className="page">
      <h1>Onboarding: Caregiver Info</h1>
      <p>Choose one option.</p>
      <div className="form">
        <label>
          <input
            type="radio"
            name="caregiverType"
            checked={onboarding.caregiverType === 'pregnant'}
            onChange={() =>
              setOnboarding((prev) => ({
                ...prev,
                caregiverType: 'pregnant',
                pregnantWeeks: '',
                postpartumWeeks: '',
                childAgeValue: '',
                childAgeUnit: '',
              }))
            }
          />
          Pregnant
        </label>
        <label>
          <input
            type="radio"
            name="caregiverType"
            checked={onboarding.caregiverType === 'postpartum'}
            onChange={() =>
              setOnboarding((prev) => ({
                ...prev,
                caregiverType: 'postpartum',
                pregnantWeeks: '',
                postpartumWeeks: '',
                childAgeValue: '',
                childAgeUnit: '',
              }))
            }
          />
          Postpartum
        </label>
        <label>
          <input
            type="radio"
            name="caregiverType"
            checked={onboarding.caregiverType === 'other'}
            onChange={() =>
              setOnboarding((prev) => ({
                ...prev,
                caregiverType: 'other',
                pregnantWeeks: '',
                postpartumWeeks: '',
                childAgeValue: '',
                childAgeUnit: '',
              }))
            }
          />
          Other
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

export default CaregiverInfoStep
