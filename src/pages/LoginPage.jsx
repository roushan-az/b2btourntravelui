import { useState } from "react";
import Navbar from "../components/Navbar";
import client from "../api/client";

export default function LoginPage({ onLogin, navigate }) {
  const [tab, setTab] = useState("agent");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resetStep, setResetStep] = useState("login"); // "login", "request", "verify"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await client.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userRole', tab); 
      
      onLogin(tab); 
    } catch (err) {
      // --- THE FIX: Read the specific backend error ---
      if (err.response?.status === 403) {
        setError("Your account is pending admin approval. Please wait to be verified.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
      // ----------------------------------------------
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)", display: "flex", flexDirection: "column" }}>
      <Navbar navigate={navigate} />

      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--space-2xl) var(--space-xl)", paddingTop: "100px",
        background: "linear-gradient(135deg, var(--snow) 0%, var(--snow-warm) 100%)",
      }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "18px",
              background: "linear-gradient(135deg, var(--pine) 0%, var(--glacier) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", margin: "0 auto var(--space-md)",
              boxShadow: "var(--shadow-forest)",
            }}>⛰</div>
            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>WanderKashmir</h2>
            <p style={{ fontSize: "0.875rem" }}>Sign in to your portal</p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: "flex", background: "var(--snow-warm)", borderRadius: "var(--radius-full)",
            padding: "4px", marginBottom: "var(--space-xl)",
            border: "1px solid var(--border)",
          }}>
            {["agent", "admin"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "0.6rem 1rem",
                borderRadius: "var(--radius-full)", border: "none",
                background: tab === t ? (t === "admin" ? "var(--pine)" : "var(--saffron)") : "transparent",
                color: tab === t ? "white" : "var(--ink-muted)",
                fontFamily: "var(--font-body)", fontWeight: 600,
                fontSize: "0.85rem", letterSpacing: "0.04em",
                cursor: "pointer", transition: "all var(--transition)",
                textTransform: "uppercase",
              }}>
                {t === "agent" ? "🧑‍💼 Sub-Agent" : "🛡 Super Admin"}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="card" style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-xs)", fontSize: "1.6rem" }}>
              {tab === "agent" ? "Agent Sign In" : "Admin Sign In"}
            </h3>
            <p style={{ fontSize: "0.875rem", marginBottom: "var(--space-xl)" }}>
              {tab === "agent" ? "Build packages, generate quotations" : "Manage portal content & pricing"}
            </p>

            {error && (
              <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={tab === "agent" ? "agent@example.com" : "admin@wanderkashmir.com"}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--saffron)", cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
                </div>

                <button
                  type="submit"
                  className={`btn ${tab === "admin" ? "btn-forest" : "btn-primary"} w-full`}
                  style={{ justifyContent: "center", padding: "0.9rem", marginTop: "var(--space-sm)" }}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Signing in...
                    </span>
                  ) : `Sign In as ${tab === "agent" ? "Agent" : "Admin"}`}
                </button>
              </div>
            </form>

            {/* Demo credentials */}
            <div style={{
              marginTop: "var(--space-lg)", padding: "var(--space-md)", borderRadius: "var(--radius-md)",
              background: "var(--snow-warm)", border: "1px dashed var(--border-strong)",
            }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "6px" }}>Demo Credentials</div>
              <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>Email: <strong style={{ color: "var(--ink)" }}>demo@wanderkashmir.com</strong></div>
              <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>Password: <strong style={{ color: "var(--ink)" }}>demo1234</strong></div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "var(--space-lg)", fontSize: "0.875rem" }}>
            Don't have access? 
            <span 
              style={{ color: "var(--saffron)", cursor: "pointer", fontWeight: 600, marginLeft: "5px" }} 
              onClick={() => navigate("register")}
            >
              Request Agent Account
            </span>
          </p>

          <button
            onClick={() => navigate("landing")}
            style={{ display: "block", margin: "var(--space-md) auto 0", background: "none", border: "none", cursor: "pointer", color: "var(--ink-muted)", fontSize: "0.8rem" }}
          >← Back to homepage</button>
        </div>
      </div>
    </div>
  );
}
