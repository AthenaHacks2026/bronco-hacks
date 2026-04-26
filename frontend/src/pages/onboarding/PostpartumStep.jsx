import { useNavigate } from 'react-router-dom'
import logo from '../../assets/website-icon.png'
import './PregnantStep.css'

function PostpartumStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(String(onboarding.postpartumWeeks || '').trim())

  const handleBack = () => {
    navigate('/onboarding/caregiver-info')
  }

  const handleContinue = () => {
    if (!canContinue) return
    navigate('/onboarding/needs')
  }

  return (
    <main className="pregnant-page">
      <header className="pregnant-header">
        <div className="pregnant-brand-wrap">
          <img src={logo} alt="LittleLoop logo" className="pregnant-logo-img" />
          <span className="pregnant-brand-text">Logo Name</span>
        </div>
      </header>

      <section className="pregnant-content">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-step active">1</div>
          <div className="progress-line active" />
          <div className="progress-step active">2</div>
          <div className="progress-line" />
          <div className="progress-step">3</div>
        </div>

        {/* Title */}
        <h1 className="pregnant-title">How far postpartum are you?</h1>
        <p className="pregnant-subtitle">
          This helps provide better recommendations.
        </p>

        {/* Card (THIS is what fixes your layout) */}
        <div className="pregnant-card">
          <label htmlFor="postpartum-weeks" className="pregnant-label">
            Weeks postpartum
          </label>

          <input
            id="postpartum-weeks"
            type="number"
            min="0"
            className="pregnant-input"
            placeholder="Enter weeks (e.g., 6)"
            value={onboarding.postpartumWeeks}
            onChange={(event) =>
              setOnboarding((prev) => ({
                ...prev,
                postpartumWeeks: event.target.value,
              }))
            }
          />
        </div>

        {/* Buttons */}
        <div className="pregnant-button-row">
          <button
            type="button"
            className="pregnant-back-button"
            onClick={handleBack}
          >
            Back
          </button>

          <button
            type="button"
            className="pregnant-continue-button"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue →
          </button>
        </div>
      </section>
    </main>
  )
}

export default PostpartumStep