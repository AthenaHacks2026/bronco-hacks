import { Link } from "react-router-dom";
import { useState } from "react";

function UploadPage() {
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("used");
  const [category, setCategory] = useState("feeding");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!image) {
      setResult({ error: "Please upload an image." });
      return;
    }

    if (!token) {
      setResult({ error: "Please log in again to upload items." });
      return;
    }

    if (!brand || !year) {
      setResult({ error: "Brand and year are required." });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", itemName || description);
    formData.append("condition", condition);
    formData.append("brand", brand);
    formData.append("year", year);
    formData.append("category", category);
    formData.append("description", description);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/api/items/analyze-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : {};

      if (!response.ok) {
        setResult({
          error: data.error || data.message || "Failed to upload item.",
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({ error: `Network error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page upload-layout">
      <div className="upload-topbar">
        <div className="brand-mark">
          <div className="brand-logo-circle">◌</div>
          <span>Logo Name</span>
        </div>

        <Link className="button-link top-donate-link" to="/dashboard">
          Back
        </Link>

        <div className="brand-mark right">
          <div className="brand-logo-circle">◌</div>
        </div>
      </div>

      <section className="upload-hero">
        <div>
          <h1>Item Details</h1>
          <p>Check item details.</p>
        </div>
      </section>

      <div className="upload-content-card">
        <form className="form upload-form-grid" onSubmit={handleSubmit}>
          <div className="field-group full-width">
            <label>Images</label>

            <div className="upload-image-grid">
              <label className="upload-image-box upload-image-box-active">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
                <span className="upload-image-icon">📷</span>
                <span className="upload-image-title">
                  {image ? image.name : "Add photos"}
                </span>
                <span className="upload-image-subtitle">Click to upload images</span>
              </label>

              <div className="upload-image-box">
                <span className="upload-image-icon">🖼️</span>
                <span className="upload-image-title">Take Photo</span>
                <span className="upload-image-subtitle">Tap to upload images</span>
              </div>
            </div>
          </div>

          <div className="field-group full-width">
            <label htmlFor="item-name">Name</label>
            <input
              id="item-name"
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="field-group full-width">
            <label>Condition</label>
            <div className="choice-row">
              <button
                type="button"
                className={`choice-chip ${condition === "new" ? "active" : ""}`}
                onClick={() => setCondition("new")}
              >
                New
              </button>
              <button
                type="button"
                className={`choice-chip ${condition === "used" ? "active" : ""}`}
                onClick={() => setCondition("used")}
              >
                Good
              </button>
              <button
                type="button"
                className={`choice-chip ${condition === "like_new" ? "active" : ""}`}
                onClick={() => setCondition("like_new")}
              >
                Like New
              </button>
              <button type="button" className="choice-chip">
                Fair
              </button>
            </div>
          </div>

          <div className="field-group full-width">
            <label>Category</label>
            <div className="choice-row">
              <button
                type="button"
                className={`choice-chip ${category === "clothing" ? "active" : ""}`}
                onClick={() => setCategory("clothing")}
              >
                Clothing
              </button>
              <button
                type="button"
                className={`choice-chip ${category === "essentials" ? "active" : ""}`}
                onClick={() => setCategory("essentials")}
              >
                Essentials
              </button>
              <button
                type="button"
                className={`choice-chip ${category === "feeding" ? "active" : ""}`}
                onClick={() => setCategory("feeding")}
              >
                Feeding
              </button>
              <button
                type="button"
                className={`choice-chip ${category === "other" ? "active" : ""}`}
                onClick={() => setCategory("other")}
              >
                Other
              </button>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              type="text"
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="field-group full-width">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              rows="5"
              placeholder="Add any additional details about this item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {result?.error && (
            <section className="settings-form error-box full-width">
              <h2>Error</h2>
              <p>{result.error}</p>
            </section>
          )}

          {result && !result.error && (
            <section className="settings-form success-box full-width">
              <h2>AI Result</h2>
              <p><strong>Status:</strong> {result.final_status}</p>
              <p><strong>Reason:</strong> {result.final_reason}</p>
              <p><strong>Item Name:</strong> {result.item_name}</p>
              <p><strong>Detected Brand:</strong> {result.detected_brand}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Recall Status:</strong> {result.recall?.recall_status}</p>
            </section>
          )}

          <div className="button-row upload-button-row full-width">
            <Link className="button-link secondary-pill" to="/dashboard">
              Back
            </Link>

            <button className="primary-pill" type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Add availability +"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default UploadPage;