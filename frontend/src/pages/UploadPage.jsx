import { useState } from "react";

function UploadPage() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("used");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setResult({ error: "Please upload an image." });
      return;
    }

    if (!brand || !year) {
      setResult({ error: "Brand and year are required." });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", text);
    formData.append("condition", condition);
    formData.append("brand", brand);
    formData.append("year", year);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/items/analyze-image", {
        method: "POST",
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
    <main className="page">
      <h1>Upload Item</h1>
      <p>Upload a baby item for review and safety checks.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="image">Upload Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <label htmlFor="text">AI Chat Description</label>
        <textarea
          id="text"
          rows="5"
          placeholder="Describe the item here, for example: Baby Bottle Trial Pack Variety Box for Newborns, new, bought in 2026..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label htmlFor="brand">Brand</label>
        <input
          id="brand"
          type="text"
          placeholder="Enter brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />

        <label htmlFor="year">Year</label>
        <input
          id="year"
          type="text"
          placeholder="Enter year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <label htmlFor="condition">Condition</label>
        <select
          id="condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="new">New</option>
          <option value="like_new">Like New</option>
          <option value="used">Used</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit Item"}
        </button>
      </form>

      {result?.error && (
        <section className="settings-form">
          <h2>Error</h2>
          <p>{result.error}</p>
        </section>
      )}

      {result && !result.error && (
        <section className="settings-form">
          <h2>Result</h2>
          <p><strong>Status:</strong> {result.final_status}</p>
          <p><strong>Reason:</strong> {result.final_reason}</p>
          <p><strong>Item Name:</strong> {result.item_name}</p>
          <p><strong>Detected Brand:</strong> {result.detected_brand}</p>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Recall Status:</strong> {result.recall?.recall_status}</p>

          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}

export default UploadPage;