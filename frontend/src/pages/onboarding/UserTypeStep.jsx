import { useNavigate } from 'react-router-dom'
import './UserTypeStep.css'

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

  const handleSelect = (type) => {
    setOnboarding((prev) => ({ ...prev, userType: type }))
  }

  return (
    <main className="user-type-page">
      <div className="user-type-logo">LittleLoop</div>

      <section className="user-type-content">
        <h1 className="user-type-title">
          Welcome to the
          <br />
          LittleLoop Network!
        </h1>

        <p className="user-type-subtitle">
          Tell us how you would like to participate.
        </p>

        <div className="user-type-cards">
          <button
            type="button"
            className={`user-type-card caregiver ${
              onboarding.userType === 'caregiver' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('caregiver')}
          >
            <div className="user-type-card-inner">
              <div className="icon-circle pink">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                >
                  <path
                    d="M14.6667 28C22.0305 28 28 22.0305 28 14.6667C28 7.30287 22.0305 1.33333 14.6667 1.33333C7.30287 1.33333 1.33333 7.30287 1.33333 14.6667C1.33333 22.0305 7.30287 28 14.6667 28Z"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="user-type-text">
                <h3>I'm a Caregiver</h3>
                <p>
                  I'm pregnant, postpartum, or caring for a child and need
                  support finding essential items for my family.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className={`user-type-card donor ${
              onboarding.userType === 'donor' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('donor')}
          >
            <div className="user-type-card-inner">
              <div className="icon-circle green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M25.3334 18.6667C27.32 16.72 29.3334 14.3867 29.3334 11.3333C29.3334 9.38841 28.5607 7.52315 27.1855 6.14788C25.8102 4.77262 23.9449 4 22 4C19.6534 4 18 4.66667 16 6.66667C14 4.66667 12.3467 4 10 4C8.0551 4 6.18984 4.77262 4.81457 6.14788C3.4393 7.52315 2.66669 9.38841 2.66669 11.3333C2.66669 14.4 4.66669 16.7333 6.66669 18.6667L16 28L25.3334 18.6667Z"
                    fill="#FDFAF1"
                    stroke="#FDFAF1"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="user-type-text">
                <h3>I'm a Donor</h3>
                <p>
                  I have gently used baby items to donate and want to help
                  families in my community who need support.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className={`user-type-card both ${
              onboarding.userType === 'both' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('both')}
          >
            <div className="user-type-card-inner">
              <div className="icon-circle orange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
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
                    d="M4.38666 9.33333L16 16L27.6133 9.33333"
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

              <div className="user-type-text">
                <h3>Both</h3>
                <p>
                  I'd like to both receive support and donate items to help
                  other families.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="user-type-button-row">
          <button
            type="button"
            className="user-type-back-button"
            onClick={() => navigate('/signup')}
          >
            Back
          </button>

          <button
            type="button"
            className="user-type-continue-button"
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

export default UserTypeStep