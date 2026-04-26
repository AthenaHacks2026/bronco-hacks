import { useNavigate } from 'react-router-dom'

function DonorInfoStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()

  const canContinue =
    onboarding.donorInfo.location.trim() !== '' &&
    onboarding.donorInfo.phone.trim() !== ''

  const handleContinue = () => {
    if (!canContinue) return

    setOnboarding((prev) => ({
      ...prev,
      needsConfidence: '',
      needTags: [],
    }))

    navigate('/onboarding/donor-thanks')
  }

  return (
    <main className="page donor-info-page">
      <div className="littleloop-brand">LittleLoop</div>

      <div className="donor-info-content">
        <h1 className="donor-title">Tell us about yourself</h1>
        <p className="donor-subtitle">
          This helps us connect you to caregivers in your area.
        </p>

        <form className="form donor-form">
          <label htmlFor="donor-location">⌖ Location / Neighborhood</label>
          <input
            id="donor-location"
            type="text"
            placeholder="e.g., Downtown, Westside, 90210"
            value={onboarding.donorInfo.location}
            onChange={(event) =>
              setOnboarding((prev) => ({
                ...prev,
                donorInfo: {
                  ...prev.donorInfo,
                  location: event.target.value,
                },
              }))
            }
            required
          />

          <label htmlFor="donor-street">⌂ Street Address (optional)</label>
          <input
            id="donor-street"
            type="text"
            placeholder="123 Main St"
            value={onboarding.donorInfo.streetAddress}
            onChange={(event) =>
              setOnboarding((prev) => ({
                ...prev,
                donorInfo: {
                  ...prev.donorInfo,
                  streetAddress: event.target.value,
                },
              }))
            }
          />
          <small className="field-note">
            Only shared when coordinating pickup/dropoff
          </small>

          <label htmlFor="donor-phone">✆ Phone Number</label>
          <input
            id="donor-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={onboarding.donorInfo.phone}
            onChange={(event) =>
              setOnboarding((prev) => ({
                ...prev,
                donorInfo: {
                  ...prev.donorInfo,
                  phone: event.target.value,
                },
              }))
            }
            required
          />
        </form>

        <div className="button-row donor-button-row">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/onboarding/user-type')}
          >
            Back
          </button>

          <button
            type="button"
            className="continue-btn"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue to Dashboard →
          </button>
        </div>
      </div>
    </main>
  )
}

export default DonorInfoStep