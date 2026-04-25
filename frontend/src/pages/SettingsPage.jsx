import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const formatPregnantDisplay = (value) => {
  if (!value) return ''
  if (value.toLowerCase().includes('pregnant')) return value
  return `${value} weeks pregnant`
}

const formatPostpartumDisplay = (value) => {
  if (!value) return ''
  if (value.toLowerCase().includes('postpartum')) return value
  return `${value} weeks postpartum`
}

const formatChildAgeDisplay = (value, unit) => {
  if (!value) return ''
  if (value.toLowerCase().includes('old')) return value
  if (unit === 'years') return `${value} year old`
  return `${value} weeks old`
}

const inferChildAgeUnit = (value) => {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower.includes('year')) return 'years'
  if (lower.includes('week')) return 'weeks'
  return null
}

function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState(null)
  const [newTag, setNewTag] = useState('')

  const handleLoadSettings = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setErrorMessage('Missing auth token. Please log in again.')
      setFormData(null)
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to load user settings.')
        setFormData(null)
        return
      }

      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        onboarding: {
          userType: data.user.onboarding?.userType || '',
          donorInfo: {
            location: data.user.onboarding?.donorInfo?.location || '',
            streetAddress: data.user.onboarding?.donorInfo?.streetAddress || '',
            phone: data.user.onboarding?.donorInfo?.phone || '',
          },
          caregiverType: data.user.onboarding?.caregiverType || '',
          pregnantWeeks: formatPregnantDisplay(data.user.onboarding?.pregnantWeeks || ''),
          postpartumWeeks: formatPostpartumDisplay(data.user.onboarding?.postpartumWeeks || ''),
          childAgeValue: formatChildAgeDisplay(
            data.user.onboarding?.childAgeValue || '',
            data.user.onboarding?.childAgeUnit || ''
          ),
          needTags: data.user.onboarding?.needTags || [],
        },
      })
    } catch (error) {
      setErrorMessage(`Network error: ${error.message}`)
      setFormData(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      handleLoadSettings()
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOnboardingFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        [name]: value,
      },
    }))
  }

  const handleDonorFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        donorInfo: {
          ...prev.onboarding.donorInfo,
          [name]: value,
        },
      },
    }))
  }

  const handleAddTag = () => {
    const cleaned = newTag.trim()
    if (!cleaned || !formData) return

    setFormData((prev) => {
      if (prev.onboarding.needTags.includes(cleaned)) {
        return prev
      }
      return {
        ...prev,
        onboarding: {
          ...prev.onboarding,
          needTags: [...prev.onboarding.needTags, cleaned],
        },
      }
    })
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        needTags: prev.onboarding.needTags.filter((tag) => tag !== tagToRemove),
      },
    }))
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('token')
    if (!token || !formData) {
      setErrorMessage('Missing auth token. Please log in again.')
      return
    }

    setIsUpdating(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        onboarding: {
          ...formData.onboarding,
          needTags: formData.onboarding.needTags,
          childAgeUnit: inferChildAgeUnit(formData.onboarding.childAgeValue),
        },
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to update settings.')
        return
      }

      setSuccessMessage('Settings updated successfully.')
    } catch (error) {
      setErrorMessage(`Network error: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <main className="page">
      <h1>Settings</h1>
      <div className="button-row">
        <Link className="button-link" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
      {isLoading && <p>Loading settings...</p>}

      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}

      {formData && (
        <form className="form settings-form" onSubmit={handleUpdate}>
          <h2>User Settings</h2>

          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleFieldChange} />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleFieldChange} />

          <label htmlFor="userType">User Type</label>
          <input id="userType" name="userType" value={formData.onboarding.userType} onChange={handleOnboardingFieldChange} />

          {(formData.onboarding.userType === 'caregiver' || formData.onboarding.userType === 'both') && (
            <>
              <label htmlFor="caregiverType">Caregiver Type</label>
              <input id="caregiverType" name="caregiverType" value={formData.onboarding.caregiverType} onChange={handleOnboardingFieldChange} />
            </>
          )}

          {(formData.onboarding.userType === 'donor' || formData.onboarding.userType === 'both') && (
            <>
              <label htmlFor="location">Donor Location</label>
              <input id="location" name="location" value={formData.onboarding.donorInfo.location} onChange={handleDonorFieldChange} />

              <label htmlFor="streetAddress">Street Address</label>
              <input id="streetAddress" name="streetAddress" value={formData.onboarding.donorInfo.streetAddress} onChange={handleDonorFieldChange} />

              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={formData.onboarding.donorInfo.phone} onChange={handleDonorFieldChange} />
            </>
          )}

          {formData.onboarding.caregiverType === 'pregnant' && (
            <>
              <label htmlFor="pregnantWeeks">Pregnancy</label>
              <input id="pregnantWeeks" name="pregnantWeeks" value={formData.onboarding.pregnantWeeks} onChange={handleOnboardingFieldChange} />
            </>
          )}

          {formData.onboarding.caregiverType === 'postpartum' && (
            <>
              <label htmlFor="postpartumWeeks">Postpartum</label>
              <input id="postpartumWeeks" name="postpartumWeeks" value={formData.onboarding.postpartumWeeks} onChange={handleOnboardingFieldChange} />
            </>
          )}

          {formData.onboarding.caregiverType === 'other' && (
            <>
              <label htmlFor="childAgeValue">Child Age</label>
              <input id="childAgeValue" name="childAgeValue" value={formData.onboarding.childAgeValue} onChange={handleOnboardingFieldChange} />
            </>
          )}

          <label htmlFor="newTag">Need Tags</label>
          <div className="inline-row">
            <input
              id="newTag"
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              placeholder="Add a tag"
            />
            <button type="button" onClick={handleAddTag}>
              Add
            </button>
          </div>

          <div className="tag-list">
            {formData.onboarding.needTags.map((tag) => (
              <button key={tag} type="button" className="tag-chip" onClick={() => handleRemoveTag(tag)}>
                {tag} x
              </button>
            ))}
          </div>

          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </form>
      )}
    </main>
  )
}

export default SettingsPage