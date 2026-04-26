import { useNavigate } from 'react-router-dom'
import logo from '../../assets/website-icon.png'
import './PregnantStep.css'

function PregnantStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.pregnantWeeks)

  return (
    <main className="pregnant-page">
      <header className="pregnant-header">
        <div className="pregnant-brand-wrap">
          <img src={logo} alt="LittleLoop logo" className="pregnant-logo-img" />
          <span className="pregnant-brand-text">Logo Name</span>
        </div>
      </header>

      <section className="pregnant-content">
        <div className="pregnant-progress">
          <div className="pregnant-step active">1</div>
          <div className="pregnant-line" />
          <div className="pregnant-step active">2</div>
          <div className="pregnant-line" />
          <div className="pregnant-step">3</div>
        </div>

        <h1 className="pregnant-title">How far along are you?</h1>
        <p className="pregnant-subtitle">
          This helps provide better recommendations.
        </p>

        <div className="pregnant-form-card">
          <label htmlFor="pregnant-weeks" className="pregnant-label">
            Weeks pregnant
          </label>

          <input
            id="pregnant-weeks"
            className="pregnant-input"
            type="number"
            min="1"
            placeholder="Enter weeks (e.g., 24)"
            value={onboarding.pregnantWeeks}
            onChange={(event) =>
              setOnboarding((prev) => ({
                ...prev,
                pregnantWeeks: event.target.value,
              }))
            }
          />
        </div>

        <div className="pregnant-button-row">
          <button
            type="button"
            className="pregnant-back-button"
            onClick={() => navigate('/onboarding/caregiver-info')}
          >
            Back
          </button>

          <button
            type="button"
            className="pregnant-continue-button"
            onClick={() => navigate('/onboarding/needs')}
            disabled={!canContinue}
          >
            Continue →
          </button>
        </div>
      </section>
    </main>
  )
}

export default PregnantStep