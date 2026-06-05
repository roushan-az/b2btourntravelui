import { useState } from "react";

export default function Navbar({ navigate, onLogout, userRole, currentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(248,246,242,0.92)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(26,46,26,0.10)",
      height: "64px", display: "flex", alignItems: "center",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={() => navigate(userRole === "admin" ? "admin-dashboard" : userRole ? "agent-dashboard" : "landing")}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, var(--pine) 0%, var(--glacier) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", boxShadow: "0 2px 12px rgba(26,46,26,0.3)",
          }}>⛰</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--pine)", lineHeight: 1.1 }}>WanderKashmir</div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 500 }}>B2B Travel Portal</div>
          </div>
        </div>

        {/* Navigation Links */}
        {!userRole && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xl)" }}>
            <a href="#features" style={{ fontSize: "0.875rem", color: "var(--ink-muted)", fontWeight: 500, letterSpacing: "0.02em", transition: "color var(--transition)" }}
              onMouseEnter={e => e.target.style.color = "var(--pine)"}
              onMouseLeave={e => e.target.style.color = "var(--ink-muted)"}
            >Features</a>
            <a href="#destinations" style={{ fontSize: "0.875rem", color: "var(--ink-muted)", fontWeight: 500, letterSpacing: "0.02em", transition: "color var(--transition)" }}
              onMouseEnter={e => e.target.style.color = "var(--pine)"}
              onMouseLeave={e => e.target.style.color = "var(--ink-muted)"}
            >Destinations</a>
            <a href="#testimonials" style={{ fontSize: "0.875rem", color: "var(--ink-muted)", fontWeight: 500, letterSpacing: "0.02em", transition: "color var(--transition)" }}
              onMouseEnter={e => e.target.style.color = "var(--pine)"}
              onMouseLeave={e => e.target.style.color = "var(--ink-muted)"}
            >Testimonials</a>
          </div>
        )}

        {userRole && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(26,46,26,0.06)", borderRadius: "var(--radius-full)",
              padding: "0.35rem 0.75rem 0.35rem 0.5rem",
            }}>
              <span className="status-dot active" />
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--pine)" }}>
                {userRole === "admin" ? "Super Admin" : "Sub-Agent"}
              </span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          {!userRole ? (
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate("login")}
              >Agent Login</button>
              <button
                className="btn btn-forest btn-sm"
                onClick={() => navigate("login")}
              >Admin Portal</button>
            </>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={onLogout}
            >Sign Out</button>
          )}
        </div>
      </div>
    </nav>
  );
}
