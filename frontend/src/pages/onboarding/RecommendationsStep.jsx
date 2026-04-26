import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationsStep.css'
import websiteIcon from '../../assets/website-icon.png'

function RecommendationsStep({ submitOnboarding }) {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleContinue = async () => {
    if (isSaving) return

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

  const recommendationSections = [
    {
      title: 'All Clothes',
      route: '/items/clothes',
      items: [
        '/images/clothes1.jpg',
        '/images/clothes2.jpg',
        '/images/clothes3.jpg',
        '/images/clothes4.jpg',
      ],
    },
    {
      title: 'All Toys',
      route: '/items/toys',
      items: [
        '/images/toys1.jpg',
        '/images/toys2.jpg',
        '/images/toys3.jpg',
        '/images/toys4.jpg',
      ],
    },
    {
      title: 'All Feeding',
      route: '/items/feeding',
      items: [
        '/images/feed1.jpg',
        '/images/feed2.jpg',
        '/images/feed3.jpg',
        '/images/feed4.jpg',
      ],
    },
  ]

  return (
    <main className="recommendations-page">
      <header className="recommendations-header">
        <img src={websiteIcon} alt="Website logo" className="header-logo" />

        <div className="header-center">
          <div className="search-location">
            <span className="searching-label">Searching in</span>
            <span className="searching-location">Pomona, 91768</span>
          </div>

          <div className="search-bar">Search Bar</div>
        </div>

        <img src={websiteIcon} alt="Website logo" className="header-logo" />
      </header>

      <section className="recommendations-content">
        <h1 className="recommendations-title">Recommended for your Stage</h1>

        <p className="recommendations-subtitle">
          As you approach delivery, these items can help you prepare for both your
          hospital stay and postpartum recovery. We’ve highlighted essentials
          commonly needed at this stage.
        </p>

        {message && <p className="recommendations-message">{message}</p>}

        <div className="recommendations-grid">
          {recommendationSections.map((section) => (
            <div className="recommendation-card" key={section.title}>
              <h2 className="recommendation-card-title">{section.title}</h2>

              <div className="recommendation-images">
                {section.items.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt={`${section.title} item ${index + 1}`}
                    className="recommendation-image"
                  />
                ))}
              </div>

              <button
                type="button"
                className="view-items-button"
                onClick={() => navigate(section.route)}
              >
                View Items <span>→</span>
              </button>
            </div>
          ))}
        </div>

        <div className="request-card">
          <h3 className="request-title">Can't find what you need?</h3>
          <p className="request-text">
            Create a request and we&apos;ll notify you when someone donates it
          </p>
          <button type="button" className="request-button">
            Create a Request
          </button>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/onboarding/needs')}
          >
            Back
          </button>

          <button
            type="button"
            className="continue-button"
            onClick={handleContinue}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default RecommendationsStep