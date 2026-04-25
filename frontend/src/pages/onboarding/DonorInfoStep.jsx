import { useNavigate } from 'react-router-dom'

function DonorInfoStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.donorInfo.location && onboarding.donorInfo.phone)

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
    <main className="page">
      <h1>Onboarding: Donor Info</h1>
      <form className="form">
        <label htmlFor="donor-location">Location</label>
        <input
          id="donor-location"
          value={onboarding.donorInfo.location}
          onChange={(event) =>
            setOnboarding((prev) => ({
              ...prev,
              donorInfo: { ...prev.donorInfo, location: event.target.value },
            }))
          }
          required
        />

        <label htmlFor="donor-street">Street Address (optional)</label>
        <input
          id="donor-street"
          value={onboarding.donorInfo.streetAddress}
          onChange={(event) =>
            setOnboarding((prev) => ({
              ...prev,
              donorInfo: { ...prev.donorInfo, streetAddress: event.target.value },
            }))
          }
        />

        <label htmlFor="donor-phone">Phone Number</label>
        <input
          id="donor-phone"
          value={onboarding.donorInfo.phone}
          onChange={(event) =>
            setOnboarding((prev) => ({
              ...prev,
              donorInfo: { ...prev.donorInfo, phone: event.target.value },
            }))
          }
          required
        />
      </form>
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/user-type')}>
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

export default DonorInfoStep
