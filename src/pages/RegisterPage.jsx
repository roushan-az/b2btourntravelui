import { useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function RegisterPage({ navigate }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", agencyName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // 1. Add a state to control the visibility of the success toast
  const [showToast, setShowToast] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await client.post('/auth/register', {
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        agency_name: form.agencyName,
        role: "agent" 
      });
      
      // 2. Trigger the modern toast instead of the alert
      setShowToast(true);
      
      // 3. Delay the navigation by 3 seconds so the user can read the message
      setTimeout(() => {
        setShowToast(false);
        navigate("login");
      }, 3000);

    } catch (err) {
      setError("Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)", display: "flex", flexDirection: "column", position: "relative" }}>
      
      {/* --- FLOATING TOAST NOTIFICATION --- */}
      {showToast && (
        <div style={{
          position: "fixed",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--pine, #2e7d32)", // Using your theme's pine green
          color: "white",
          padding: "14px 24px",
          borderRadius: "var(--radius-full, 50px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 9999,
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: "0.9rem",
          fontWeight: 600,
          transition: "all 0.3s ease",
        }}>
          <span style={{ fontSize: "1.2rem", display: "flex" }}>✨</span>
          Registration successful! Redirecting to login...
        </div>
      )}
      {/* ----------------------------------- */}

      <Navbar navigate={navigate} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-2xl) var(--space-xl)", paddingTop: "100px" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Create Agent Account</h2>
            <p style={{ fontSize: "0.875rem" }}>Join the WanderKashmir B2B network</p>
          </div>

          <div className="card" style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)" }}>
            {error && <div style={{ background: "#fff3f3", color: "#c62828", padding: "0.75rem", marginBottom: "var(--space-md)", borderRadius: "var(--radius-md)", fontSize: "0.875rem" }}>{error}</div>}
            
            <form onSubmit={handleRegister}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Agency Name</label>
                  <input className="form-input" required value={form.agencyName} onChange={e => setForm({...form, agencyName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-input" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: "center", padding: "0.9rem" }} disabled={loading || showToast}>
                  {loading ? "Registering..." : (showToast ? "Success!" : "Submit Registration Request")}
                </button>
              </div>
            </form>
          </div>

          <button onClick={() => navigate("login")} style={{ display: "block", margin: "var(--space-md) auto 0", background: "none", border: "none", cursor: "pointer", color: "var(--ink-muted)", fontSize: "0.8rem", fontWeight: 500 }}>
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}