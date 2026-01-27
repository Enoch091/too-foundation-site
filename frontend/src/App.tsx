import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

const NotFound = () => (
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
    <div style={{ textAlign: "center", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Page not found</h1>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Use the links below to access the app.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link to="/auth" style={{ color: "#15803d", fontWeight: 600 }}>
          Go to Auth
        </Link>
        <Link to="/admin" style={{ color: "#1d4ed8", fontWeight: 600 }}>
          Go to Admin
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
