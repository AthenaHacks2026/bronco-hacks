import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NEED_TAG_OPTIONS } from '../../constants/onboarding'

function NeedsTagsStep({ onboarding, setOnboarding, submitOnboarding }) {
  const navigate = useNavigate()
  const [customTagInput, setCustomTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const canContinue = onboarding.needTags.length > 0

  const toggleTag = (tag) => {
    setOnboarding((prev) => {
      const hasTag = prev.needTags.includes(tag)
      return {
        ...prev,
        needTags: hasTag ? prev.needTags.filter((item) => item !== tag) : [...prev.needTags, tag],
      }
    })
  }

  const addCustomTag = () => {
    const cleaned = customTagInput.trim()
    if (!cleaned) return
    setOnboarding((prev) => {
      if (prev.needTags.includes(cleaned)) return prev
      return { ...prev, needTags: [...prev.needTags, cleaned] }
    })
    setCustomTagInput('')
  }

  const handleContinue = async () => {
    if (!canContinue || isSaving) return
    setIsSaving(true)
    setMessage('')
    const result = await submitOnboarding()
    if (result.ok) {
      navigate('/dashboard')
    } else {
      setMessage(result.message || 'Failed to save onboarding.')
    }
    setIsSaving(false)
  }

  return (
    <main className="page">
      <h1>Onboarding: Need Tags</h1>
      <p>Select what you need.</p>
      <div className="form">
        {NEED_TAG_OPTIONS.map((tag) => (
          <label key={tag}>
            <input type="checkbox" checked={onboarding.needTags.includes(tag)} onChange={() => toggleTag(tag)} />
            {tag}
          </label>
        ))}
      </div>

      <label htmlFor="custom-tag">Add your own tag</label>
      <div className="inline-row">
        <input
          id="custom-tag"
          value={customTagInput}
          onChange={(event) => setCustomTagInput(event.target.value)}
          placeholder="Type a custom tag"
        />
        <button type="button" onClick={addCustomTag}>
          Add
        </button>
      </div>

      {onboarding.needTags.length > 0 && (
        <p>
          Selected: <strong>{onboarding.needTags.join(', ')}</strong>
        </p>
      )}
      {message && <p>{message}</p>}

      <div className="button-row">
        <button type="button" onClick={() => navigate('/onboarding/needs')}>
          Back
        </button>
        {canContinue && (
          <button type="button" onClick={handleContinue} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Continue'}
          </button>
        )}
      </div>
    </main>
  )
}

export default NeedsTagsStep
