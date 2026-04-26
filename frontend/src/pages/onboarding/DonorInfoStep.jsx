import { useNavigate } from 'react-router-dom'
import '../../styles/DonorInfoStep.css'

function DonorInfoStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()

  const donorInfo = onboarding?.donorInfo || {
    location: '',
    streetAddress: '',
    phone: '',
  }

  const canContinue =
    donorInfo.location.trim() !== '' && donorInfo.phone.trim() !== ''

  const handleChange = (field, value) => {
    setOnboarding((prev) => ({
      ...prev,
      donorInfo: {
        ...(prev?.donorInfo || {
          location: '',
          streetAddress: '',
          phone: '',
        }),
        [field]: value,
      },
    }))
  }

  const handleContinue = () => {
    if (!canContinue) return

    setOnboarding((prev) => ({
      ...prev,
      needsConfidence: '',
      needTags: [],
    }))

    navigate('/onboarding/donor-thanks')
  }

  const handleBack = () => {
    navigate('/onboarding/user-type')
  }

  return (
    <main className="donor-page">
      <div className="donor-logo">LittleLoop</div>

      <section className="donor-shell">
        <h1 className="donor-heading">Tell us about yourself</h1>
        <p className="donor-subtitle">
          This helps us connect you to caregivers in your area.
        </p>

        <form className="donor-card" onSubmit={(e) => e.preventDefault()}>
          <div className="donor-field">
            <label htmlFor="donor-location">⌖ Location / Neighborhood</label>
            <input
              id="donor-location"
              type="text"
              placeholder="e.g., Downtown, Westside, 90210"
              value={donorInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="donor-field">
            <label htmlFor="donor-street">⌂ Street Address (optional)</label>
            <input
              id="donor-street"
              type="text"
              placeholder="123 Main St"
              value={donorInfo.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
            />
            <small className="donor-note">
              Only shared when coordinating pickup/dropoff
            </small>
          </div>

          <div className="donor-field donor-field-last">
            <label htmlFor="donor-phone">✆ Phone Number</label>
            <input
              id="donor-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={donorInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </form>

        <div className="donor-actions">
          <button type="button" className="donor-back-btn" onClick={handleBack}>
            Back
          </button>

          <button
            type="button"
            className="donor-continue-btn"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue to Dashboard →
          </button>
        </div>
      </section>
    </main>
  )
}

export default DonorInfoStep