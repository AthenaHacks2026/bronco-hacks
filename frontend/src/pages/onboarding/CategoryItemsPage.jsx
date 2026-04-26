import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CategoryItemsPage.css'
import websiteIcon from '../../assets/website-icon.png'

function CategoryItemsPage({ breadcrumb, pageTitle, items }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return items
    }

    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.donor.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
      )
    })
  }, [items, searchTerm])

  return (
    <main className="category-items-page">
      <header className="category-items-header">
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

      <section className="category-items-content">
        <p className="breadcrumb">{breadcrumb}</p>
        <h1 className="category-page-title">{pageTitle}</h1>

        {filteredItems.length > 0 ? (
          <div className="category-items-grid">
            {filteredItems.map((item) => (
              <article className="category-item-card" key={item.id}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="category-item-image"
                />

                <div className="category-item-details">
                  <h2 className="category-item-title">{item.title}</h2>

                  <div className="category-meta">
                    <div className="category-meta-row">
                      <span>🏷</span>
                      <span>{item.category}</span>
                    </div>

                    <div className="category-meta-row">
                      <span>♡</span>
                      <span>Donated by {item.donor}</span>
                    </div>

                    <div className="category-meta-row">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>

                    <div className="category-meta-row">
                      <span>◷</span>
                      <span>Posted {item.posted}</span>
                    </div>
                  </div>

                  <button type="button" className="request-item-button">
                    Request Item <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="category-empty">No items found.</p>
        )}

        <div className="back-button-row">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </section>
    </main>
  )
}

export default CategoryItemsPage