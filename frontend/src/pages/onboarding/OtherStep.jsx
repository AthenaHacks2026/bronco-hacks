import { useNavigate } from 'react-router-dom'
import './OtherStep.css'
function OtherStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.childAgeValue && onboarding.childAgeUnit)

  return (
    <main className="onboarding-page">
      <header className="top-bar">
        <div className="logo-wrap">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Logo Name</span>
        </div>
      </header>

      <section className="onboarding-container">
        <div className="stepper">
          <div className="step completed">1</div>
          <div className="step-line active" />
          <div className="step completed">2</div>
          <div className="step-line inactive" />
          <div className="step current">3</div>
        </div>

        <h1 className="onboarding-title">How old is the child?</h1>
        <p className="onboarding-subtitle">
          This helps provide better recommendations.
        </p>

        <div className="form-card">
          <label htmlFor="child-age-value" className="input-label">
            Child age
          </label>

          <div className="input-row">
            <input
              id="child-age-value"
              type="number"
              min="0"
              placeholder="Enter age"
              className="age-input"
              value={onboarding.childAgeValue}
              onChange={(event) =>
                setOnboarding((prev) => ({
                  ...prev,
                  childAgeValue: event.target.value,
                }))
              }
            />

            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="childAgeUnit"
                  checked={onboarding.childAgeUnit === 'weeks'}
                  onChange={() =>
                    setOnboarding((prev) => ({
                      ...prev,
                      childAgeUnit: 'weeks',
                    }))
                  }
                />
                <span>Weeks</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="childAgeUnit"
                  checked={onboarding.childAgeUnit === 'years'}
                  onChange={() =>
                    setOnboarding((prev) => ({
                      ...prev,
                      childAgeUnit: 'years',
                    }))
                  }
                />
                <span>Years</span>
              </label>
            </div>
          </div>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/onboarding/caregiver-info')}
          >
            Back
          </button>

          <button
            type="button"
            className="continue-btn"
            disabled={!canContinue}
            onClick={() => navigate('/onboarding/needs')}
          >
            Continue →
          </button>
        </div>
      </section>
    </main>
  )
}

export default OtherStep