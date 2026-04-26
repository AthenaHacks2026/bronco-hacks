import { Link } from "react-router-dom";
import { useState } from "react";

function UploadPage() {
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("good");
  const [category, setCategory] = useState("feeding");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!image) {
      setResult({ error: "Please upload an image." });
      return;
    }

    if (!token) {
      setResult({ error: "Please log in again to continue." });
      return;
    }

    if (!brand.trim() || !year.trim()) {
      setResult({ error: "Brand and year are required." });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("year", year);
    formData.append("condition", condition);
    formData.append("category", category);
    formData.append("text", itemName || description);

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
          error:
            data.error ||
            data.message ||
            data.details ||
            "Something went wrong while analyzing the item.",
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
    <main className="upload-page">
      <header className="upload-header">
        <div className="upload-logo">LittleLoop</div>

        <Link to="/dashboard" className="upload-back-link">
          Back
        </Link>
      </header>

      <section className="upload-intro">
        <h1>Item Details</h1>
        <p>Check item details before adding availability.</p>
      </section>

      <section className="upload-card">
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="upload-field full-width">
            <label>Image</label>

            <label className="upload-image-box simple">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

              <span className="upload-image-text">
                {image ? image.name : "Add image"}
              </span>

              <span className="upload-image-subtext">Click to upload</span>
            </label>
          </div>

          <div className="upload-field full-width">
            <label htmlFor="itemName">Name</label>
            <input
              id="itemName"
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="upload-field full-width">
            <label>Condition</label>
            <div className="chip-row">
              <button
                type="button"
                className={`chip ${condition === "new" ? "active" : ""}`}
                onClick={() => setCondition("new")}
              >
                New
              </button>
              <button
                type="button"
                className={`chip ${condition === "good" ? "active" : ""}`}
                onClick={() => setCondition("good")}
              >
                Good
              </button>
              <button
                type="button"
                className={`chip ${condition === "like_new" ? "active" : ""}`}
                onClick={() => setCondition("like_new")}
              >
                Like New
              </button>
              <button
                type="button"
                className={`chip ${condition === "fair" ? "active" : ""}`}
                onClick={() => setCondition("fair")}
              >
                Fair
              </button>
            </div>
          </div>

          <div className="upload-field full-width">
            <label>Category</label>
            <div className="chip-row">
              <button
                type="button"
                className={`chip ${category === "clothing" ? "active" : ""}`}
                onClick={() => setCategory("clothing")}
              >
                Clothing
              </button>
              <button
                type="button"
                className={`chip ${category === "essentials" ? "active" : ""}`}
                onClick={() => setCategory("essentials")}
              >
                Essentials
              </button>
              <button
                type="button"
                className={`chip ${category === "feeding" ? "active" : ""}`}
                onClick={() => setCategory("feeding")}
              >
                Feeding
              </button>
              <button
                type="button"
                className={`chip ${category === "other" ? "active" : ""}`}
                onClick={() => setCategory("other")}
              >
                Other
              </button>
            </div>
          </div>

          <div className="upload-field">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="upload-field">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              type="text"
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="upload-field full-width">
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
            <div className="result-box error full-width">
              <h3>Error</h3>
              <p>{result.error}</p>
            </div>
          )}

          {result && !result.error && (
            <div className="result-box success full-width">
              <h3>AI Result</h3>
              <p><strong>Status:</strong> {result.final_status || "N/A"}</p>
              <p><strong>Reason:</strong> {result.final_reason || "N/A"}</p>
              <p><strong>Detected Item:</strong> {result.item_name || "Unknown"}</p>
              <p><strong>Detected Brand:</strong> {result.detected_brand || "Unknown"}</p>
              <p><strong>Category:</strong> {result.category || category}</p>
              <p><strong>Recall Status:</strong> {result.recall?.recall_status || "No recall result"}</p>
            </div>
          )}

          <div className="upload-actions full-width">
            <Link to="/dashboard" className="secondary-btn">
              Back
            </Link>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Analyzing..." : "Add availability +"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default UploadPage;