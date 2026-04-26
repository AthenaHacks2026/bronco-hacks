import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationsStep.css'
import websiteIcon from '../../assets/website-icon.png'

import image1 from '../../assets/image1.png'
import image2 from '../../assets/image2.png'
import image3 from '../../assets/image3.png'
import image4 from '../../assets/image4.png'
import image5 from '../../assets/image5.png'
import image6 from '../../assets/image6.png'
import image7 from '../../assets/image7.png'
import image8 from '../../assets/image8.png'
import image9 from '../../assets/image9.png'
import image10 from '../../assets/image10.png'
import image11 from '../../assets/image11.png'
import image12 from '../../assets/image12.png'

function RecommendationsStep({ submitOnboarding }) {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const recommendationSections = [
    {
      title: 'All Clothes',
      route: '/items/clothes',
      items: [
        { image: image1, name: 'Baby Onesie' },
        { image: image2, name: 'Baby Pajamas' },
        { image: image3, name: 'Baby Socks' },
        { image: image4, name: 'Swaddle Blanket' },
      ],
    },
    {
      title: 'All Toys',
      route: '/items/toys',
      items: [
        { image: image5, name: 'Soft Toy' },
        { image: image6, name: 'Rattle Toy' },
        { image: image7, name: 'Teething Toy' },
        { image: image8, name: 'Plush Animal' },
      ],
    },
    {
      title: 'All Feeding',
      route: '/items/feeding',
      items: [
        { image: image9, name: 'Baby Bottle' },
        { image: image10, name: 'Burp Cloth' },
        { image: image11, name: 'Bibs' },
        { image: image12, name: 'Feeding Pillow' },
      ],
    },
  ]

  const filteredSections = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase()

    if (!trimmedSearch) {
      return recommendationSections
    }

    return recommendationSections
      .map((section) => {
        const sectionMatches = section.title.toLowerCase().includes(trimmedSearch)

        const filteredItems = sectionMatches
          ? section.items
          : section.items.filter((item) =>
              item.name.toLowerCase().includes(trimmedSearch)
            )

        return {
          ...section,
          items: filteredItems,
        }
      })
      .filter((section) => section.items.length > 0)
  }, [searchTerm])

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

  return (
    <main className="recommendations-page">
      <header className="recommendations-header">
        <img src={websiteIcon} alt="Website logo" className="header-logo" />

        <div className="header-center">
          <div className="search-location">
            <span className="searching-label">Searching in</span>
            <span className="searching-location">Pomona, 91768</span>
          </div>

          <input
            type="text"
            className="search-bar"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
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

        {filteredSections.length > 0 ? (
          <div className="recommendations-grid">
            {filteredSections.map((section) => (
              <div className="recommendation-card" key={section.title}>
                <h2 className="recommendation-card-title">{section.title}</h2>

                <div className="recommendation-images">
                  {section.items.map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
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
        ) : (
          <p className="no-results">No items found for your search.</p>
        )}

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