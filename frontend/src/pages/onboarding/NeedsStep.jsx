import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/website-icon.png'
import './NeedsStep.css'

function NeedsStep({ onboarding, setOnboarding }) {
  const navigate = useNavigate()

  const [selectedCategories, setSelectedCategories] = useState([
    'Clothing',
    'Feeding',
    'Essentials',
    'Diapers',
    'Nursery',
    'Health',
    'Bath',
    'Transport',
  ])

  const canContinue = Boolean(onboarding.needsPath)

  const handleSelect = (value) => {
    setOnboarding((prev) => ({
      ...prev,
      needsPath: prev.needsPath === value ? '' : value,
    }))
  }

  const handleContinue = () => {
    if (!canContinue) return

    if (onboarding.needsPath === 'browse') {
      navigate('/onboarding/needs-tags')
      return
    }

    navigate('/onboarding/recommendations')
  }

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    )
  }

  const renderChipIcon = (category, index) => {
    if (category === 'Clothing') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <g clipPath={`url(#clip0_chip_clothing_${index})`}>
            <path
              d="M16.9835 2.88335L13.3335 1.66669C13.3335 2.55074 12.9823 3.39859 12.3572 4.02371C11.7321 4.64883 10.8842 5.00002 10.0002 5.00002C9.1161 5.00002 8.26825 4.64883 7.64313 4.02371C7.01801 3.39859 6.66682 2.55074 6.66682 1.66669L3.01682 2.88335C2.63964 3.00902 2.3198 3.26537 2.11503 3.60614C1.91027 3.94691 1.83405 4.34966 1.90016 4.74169L2.38349 7.63335C2.41522 7.82911 2.51572 8.00714 2.66694 8.13545C2.81816 8.26375 3.01017 8.33393 3.20849 8.33335H5.00016V16.6667C5.00016 17.5834 5.75016 18.3334 6.66682 18.3334H13.3335C13.7755 18.3334 14.1994 18.1578 14.512 17.8452C14.8246 17.5326 15.0002 17.1087 15.0002 16.6667V8.33335H16.7918C16.9901 8.33393 17.1822 8.26375 17.3334 8.13545C17.4846 8.00714 17.5851 7.82911 17.6168 7.63335L18.1002 4.74169C18.1663 4.34966 18.09 3.94691 17.8853 3.60614C17.6805 3.26537 17.3607 3.00902 16.9835 2.88335Z"
              stroke="black"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id={`clip0_chip_clothing_${index}`}>
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    }

    if (category === 'Feeding') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M14.1667 8.33333C14.1667 10.6345 12.3012 12.5 10 12.5C7.69881 12.5 5.83334 10.6345 5.83334 8.33333C5.83334 6.03215 7.69881 4.16667 10 4.16667C12.3012 4.16667 14.1667 6.03215 14.1667 8.33333Z"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 1.66667V4.16667"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
          <path
            d="M4.6967 3.03033L6.46447 4.7981"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
          <path
            d="M2.50001 8.33333H5.00001"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
          <path
            d="M15 8.33333H17.5"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
          <path
            d="M13.5355 4.7981L15.3033 3.03033"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
          <path
            d="M10 12.5V18.3333"
            stroke="black"
            strokeWidth="1.66667"
            strokeLinecap="round"
          />
        </svg>
      )
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M8.33334 1.66667H11.6667L16.6667 4.16667V15.8333L11.6667 18.3333H8.33334L3.33334 15.8333V4.16667L8.33334 1.66667Z"
          stroke="black"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.33334 4.16667L10 8.33334L16.6667 4.16667"
          stroke="black"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 8.33334V18.3333"
          stroke="black"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const categories = [
    'Clothing',
    'Feeding',
    'Essentials',
    'Diapers',
    'Nursery',
    'Health',
    'Bath',
    'Transport',
  ]

  return (
    <main className="needs-page">
      <header className="needs-header">
        <div className="needs-brand-wrap">
          <img src={logo} alt="LittleLoop logo" className="needs-logo-img" />
          <span className="needs-brand-text">Logo Name</span>
        </div>
      </header>

      <section className="needs-content">
        <div className="needs-progress">
          <div className="needs-step active">1</div>
          <div className="needs-line" />
          <div className="needs-step active">2</div>
          <div className="needs-line" />
          <div className="needs-step active">3</div>
        </div>

        <h1 className="needs-title">What are you looking for?</h1>
        <p className="needs-subtitle">Help us understand your needs</p>

        <div className="needs-options">
          <button
            type="button"
            className={`needs-option ${
              onboarding.needsPath === 'browse' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('browse')}
          >
            <div className="needs-option-left">
              <div className="needs-option-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#FDFAF1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.0002 21L16.7002 16.7"
                    stroke="#FDFAF1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="needs-option-text">
                <h3>I know what I need</h3>
                <p>Browse by category</p>
              </div>
            </div>

            <div className="needs-option-right">
              <span className="needs-chevron">
                {onboarding.needsPath === 'browse' ? '⌃' : '⌄'}
              </span>
            </div>
          </button>

          {onboarding.needsPath === 'browse' && (
            <div className="needs-browse-panel">
              <h3 className="needs-browse-title">Select categories</h3>

              <div className="needs-chip-row">
                {categories.map((category, index) => (
                  <button
                    key={`${category}-${index}`}
                    type="button"
                    className={`needs-chip ${
                      selectedCategories.includes(category) ? 'selected' : ''
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="needs-chip-close">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                      >
                        <path
                          d="M10.0026 11L5.50354 6.49679L1.0045 11L0 9.99614L4.50611 5.5L0 1.00386L1.0045 0L5.50354 4.50321L10.0026 0.00706957L11 1.00386L6.50096 5.5L11 9.99614L10.0026 11Z"
                          fill="black"
                        />
                      </svg>
                    </span>

                    <span className="needs-chip-icon">
                      {renderChipIcon(category, index)}
                    </span>

                    <span className="needs-chip-label">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className={`needs-option ${
              onboarding.needsPath === 'recommend' ? 'selected' : ''
            }`}
            onClick={() => handleSelect('recommend')}
          >
            <div className="needs-option-left">
              <div className="needs-option-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#FDFAF1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.08984 9.00002C9.32495 8.33169 9.789 7.76813 10.3998 7.40915C11.0106 7.05018 11.7287 6.91896 12.427 7.03873C13.1253 7.15851 13.7587 7.52154 14.2149 8.06355C14.6712 8.60555 14.9209 9.29154 14.9198 10C14.9198 12 11.9198 13 11.9198 13"
                    stroke="#FDFAF1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 17H12.01"
                    stroke="#FDFAF1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="needs-option-text">
                <h3>I’m not sure yet</h3>
                <p>Show me recommendations</p>
              </div>
            </div>

            <div className="needs-option-right" />
          </button>
        </div>

        <div className="needs-button-row">
          <button
            type="button"
            className="needs-back-button"
            onClick={() => navigate('/onboarding/pregnant')}
          >
            Back
          </button>

          <button
            type="button"
            className="needs-continue-button"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Go to Dashboard →
          </button>
        </div>
      </section>
    </main>
  )
}

export default NeedsStep