import { Link } from "react-router-dom";

function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <main className="page">
      <h1>Welcome to Your Dashboard</h1>

      <p>This is where your approved items will appear.</p>

      {/* Action buttons */}
      <div className="button-row">
        <Link className="button-link" to="/upload">
          Upload Item
        </Link>

        <Link className="button-link" to="/settings">
          Settings
        </Link>
      </div>

      {/* Placeholder for items */}
      <section>
        <h2>Your Items</h2>
        <p>No items yet. Upload your first donation!</p>
      </section>

      {/* Logout */}
      <p>
        <Link to="/" onClick={handleLogout}>
          Logout
        </Link>
      </p>
    </main>
  );
}

export default DashboardPage;