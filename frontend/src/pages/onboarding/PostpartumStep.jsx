import { useNavigate } from 'react-router-dom'

function PostpartumStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()
  const canContinue = Boolean(onboarding.postpartumWeeks)

  return (
    <main className="page">
      <h1>Onboarding: Postpartum</h1>
      <label htmlFor="postpartum-weeks">How many weeks since birth?</label>
      <input
        id="postpartum-weeks"
        type="number"
        min="0"
        value={onboarding.postpartumWeeks}
        onChange={(event) => setOnboarding((prev) => ({ ...prev, postpartumWeeks: event.target.value }))}
      />
      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/caregiver-info')}>
          Back
        </button>
        {canContinue && (
          <button type="button" onClick={() => navigate('/onboarding/needs')}>
            Continue
          </button>
        )}
      </div>
    </main>
  )
}

export default PostpartumStep
