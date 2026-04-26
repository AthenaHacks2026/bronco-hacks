import { useNavigate } from 'react-router-dom'
import logo from '../../assets/website-icon.png'
import './CaregiverInfoStep.css'

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

  const handleSelect = (type) => {
    setOnboarding((prev) => ({
      ...prev,
      caregiverType: prev.caregiverType === type ? '' : type,
      pregnantWeeks: '',
      postpartumWeeks: '',
      childAgeValue: '',
      childAgeUnit: '',
      needsConfidence: '',
      needTags: [],
    }))
  }

  return (
    <main className="caregiver-page">
      <header className="caregiver-header">
        <div className="caregiver-brand-wrap">
          <img src={logo} alt="LittleLoop logo" className="caregiver-logo-img" />
          <span className="caregiver-brand-text">LittleLoop</span>
        </div>
      </header>

      <section className="caregiver-content">
        <div className="progress-container">
          <div className="progress-step active">1</div>
          <div className="progress-line" />
          <div className="progress-step">2</div>
          <div className="progress-line" />
          <div className="progress-step">3</div>
        </div>

        <h1 className="caregiver-title">Let us get to know you.</h1>
        <p className="caregiver-subtitle">
          What best describes your current situation?
        </p>

        <div className="caregiver-cards">
          <button
            type="button"
            className={`caregiver-card ${
              onboarding.caregiverType === 'pregnant' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('pregnant')}
          >
            {onboarding.caregiverType === 'pregnant' && (
              <span className="caregiver-check">✓</span>
            )}

            <div className="caregiver-card-inner">
              <div className="caregiver-icon-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="caregiver-icon-svg"
                >
                  <path
                    d="M14.6666 28C22.0304 28 27.9999 22.0305 27.9999 14.6667C27.9999 7.30288 22.0304 1.33334 14.6666 1.33334C7.30279 1.33334 1.33325 7.30288 1.33325 14.6667C1.33325 22.0305 7.30279 28 14.6666 28Z"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="caregiver-card-text">
                <h3>Pregnant</h3>
                <p>
                  I&apos;m pregnant, postpartum, or caring for a child and need
                  support finding essential items for my family.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className={`caregiver-card ${
              onboarding.caregiverType === 'postpartum' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('postpartum')}
          >
            {onboarding.caregiverType === 'postpartum' && (
              <span className="caregiver-check">✓</span>
            )}

            <div className="caregiver-card-inner">
              <div className="caregiver-icon-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="caregiver-icon-svg"
                >
                  <path
                    d="M25.3334 18.6667C27.3201 16.72 29.3334 14.3867 29.3334 11.3333C29.3334 9.38841 28.5608 7.52315 27.1855 6.14788C25.8103 4.77262 23.945 4 22.0001 4C19.6534 4 18.0001 4.66667 16.0001 6.66667C14.0001 4.66667 12.3467 4 10.0001 4C8.05516 4 6.1899 4.77262 4.81463 6.14788C3.43937 7.52315 2.66675 9.38841 2.66675 11.3333C2.66675 14.4 4.66675 16.7333 6.66675 18.6667L16.0001 28L25.3334 18.6667Z"
                    fill="#FDFAF1"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="caregiver-card-text">
                <h3>Postpartum</h3>
                <p>
                  I am in the postpartum stage and need support finding items
                  and resources for myself and my family.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className={`caregiver-card ${
              onboarding.caregiverType === 'other' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('other')}
          >
            {onboarding.caregiverType === 'other' && (
              <span className="caregiver-check">✓</span>
            )}

            <div className="caregiver-card-inner">
              <div className="caregiver-icon-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="caregiver-icon-svg"
                >
                  <path
                    d="M14.6667 28.9733C15.0721 29.2074 15.5319 29.3306 16 29.3306C16.4681 29.3306 16.9279 29.2074 17.3333 28.9733L26.6667 23.64C27.0717 23.4062 27.408 23.07 27.6421 22.6651C27.8761 22.2603 27.9995 21.801 28 21.3333V10.6667C27.9995 10.199 27.8761 9.73975 27.6421 9.33489C27.408 8.93002 27.0717 8.59382 26.6667 8.36L17.3333 3.02667C16.9279 2.79262 16.4681 2.6694 16 2.6694C15.5319 2.6694 15.0721 2.79262 14.6667 3.02667L5.33333 8.36C4.92835 8.59382 4.59197 8.93002 4.35795 9.33489C4.12392 9.73975 4.00048 10.199 4 10.6667V21.3333C4.00048 21.801 4.12392 22.2603 4.35795 22.6651C4.59197 23.07 4.92835 23.4062 5.33333 23.64L14.6667 28.9733Z"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 29.3333V16"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.38672 9.33334L16.0001 16L27.6134 9.33334"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 5.69333L22 12.56"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="caregiver-card-text">
                <h3>Other</h3>
                <p>
                  I have a different caregiver situation that does not fit the
                  first two options and still need support.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="caregiver-button-row">
          <button
            type="button"
            className="caregiver-back-button"
            onClick={handleBack}
          >
            Back
          </button>

          <button
            type="button"
            className="caregiver-continue-button"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue
          </button>
        </div>
      </section>
    </main>
  )
}

export default CaregiverInfoStep