import { useNavigate } from 'react-router-dom'
import './CategoryItemsPage.css'
import websiteIcon from '../../assets/website-icon.png'

function CategoryItemsPage({ pageTitle, breadcrumb, items }) {
  const navigate = useNavigate()

  return (
    <main className="category-page">
      <header className="category-header">
        <img src={websiteIcon} alt="Website logo" className="category-logo" />

        <div className="category-header-center">
          <div className="category-search-location">
            <span className="category-searching-label">Searching in</span>
            <span className="category-searching-location">Pomona, 91768</span>
          </div>

          <div className="category-search-bar">Search Bar</div>
        </div>

        <img src={websiteIcon} alt="Website logo" className="category-logo" />
      </header>

      <section className="category-content">
        <p className="breadcrumb">{breadcrumb}</p>
        <h1 className="category-title">{pageTitle}</h1>

        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <img
                src={item.image}
                alt={item.title}
                className="item-card-image"
              />

              <div className="item-card-content">
                <h2 className="item-card-title">{item.title}</h2>

                <p className="item-meta">◻ {item.category}</p>
                <p className="item-meta">♡ Donated by {item.donor}</p>
                <p className="item-meta">⌖ {item.location}</p>
                <p className="item-meta">◷ Posted {item.posted}</p>

                <button type="button" className="request-item-button">
                  Request Item <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="request-help-card">
          <h3>Can't find what you need?</h3>
          <p>Create a request and we'll notify you when someone donates it</p>
          <button type="button" className="create-request-button">
            Create a Request
          </button>
        </div>

        <div className="category-actions">
          <button
            type="button"
            className="back-page-button"
            onClick={() => navigate('/onboarding/recommendations')}
          >
            Back
          </button>

          <button
            type="button"
            className="dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </section>
    </main>
  )
}

export default CategoryItemsPage