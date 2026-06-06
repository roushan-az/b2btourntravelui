import { useState } from "react";
import Navbar from "../components/Navbar";
import { recentQuotations, packageDurations } from "../data/mockData";

const statusConfig = {
  draft: { color: "#8a8a8a", bg: "#f5f5f5", label: "Draft" },
  sent: { color: "#1565c0", bg: "#e3f2fd", label: "Sent" },
  confirmed: { color: "#2e7d32", bg: "#e8f5e9", label: "Confirmed" },
  pending: { color: "#e65100", bg: "#fff3e0", label: "Pending" },
};

export default function AgentDashboard({ navigate, onLogout }) {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);

  const handleStartPackage = (pkg) => {
    setShowDurationModal(false);
    navigate("package-builder", { nights: pkg.nights, days: pkg.days, label: pkg.label, description: pkg.description });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="agent" />

      <div style={{ paddingTop: "64px" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, var(--pine) 0%, var(--deep-water) 100%)",
          padding: "var(--space-2xl) 0 var(--space-xl)",
        }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-md)" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Welcome back</p>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2rem", fontWeight: 500 }}>
                  Sunrise Travels, Delhi
                </h2>
                <div style={{ display: "flex", gap: "var(--space-lg)", marginTop: "var(--space-md)", flexWrap: "wrap" }}>
                  {[
                    { label: "Packages This Month", value: "14" },
                    { label: "Total Revenue", value: "₹6.2L" },
                    { label: "Pending Quotations", value: "3" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontFamily: "var(--font-display)", color: "var(--saffron-light)", fontSize: "1.6rem", fontWeight: 500 }}>{s.value}</span>
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowDurationModal(true)}
                style={{ flexShrink: 0 }}
              >
                + Create New Package
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container" style={{ padding: "var(--space-xl) var(--space-xl)" }}>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-xl)" }}>

            {/* Recent Quotations */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Recent Quotations</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--saffron)", cursor: "pointer", fontWeight: 500 }}>View all →</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {recentQuotations.map((q, i) => {
                  const sc = statusConfig[q.status];
                  return (
                    <div key={q.id} className="card" style={{
                      padding: "var(--space-lg)", display: "flex", alignItems: "center",
                      gap: "var(--space-md)", cursor: "pointer",
                      animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                    }}
                      onClick={() => navigate("quotation", q)}
                    >
                      <div style={{
                        width: 48, height: 48, borderRadius: "var(--radius-md)",
                        background: "var(--snow-warm)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "1.3rem", flexShrink: 0,
                      }}>📋</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "2px" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)" }}>{q.client}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>· {q.pax} Pax · {q.nights}N</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>{q.id} · {q.destination}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--pine)", fontWeight: 500 }}>
                          ₹{typeof q.amount === "number" ? q.amount.toLocaleString("en-IN") : q.amount}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end", marginTop: "2px" }}>
                          <span style={{
                            padding: "2px 10px", borderRadius: "var(--radius-full)",
                            background: sc.bg, color: sc.color,
                            fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
                          }}>{sc.label}</span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--ink-faint)", marginTop: "2px" }}>{q.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              {/* Quick Actions */}
              <div className="card" style={{ padding: "var(--space-lg)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-md)" }}>Quick Actions</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  {[
                    { icon: "➕", label: "New Kashmir Package", action: () => setShowDurationModal(true), primary: true },
                    { icon: "📋", label: "My Quotations", action: () => {} },
                    { icon: "✅", label: "Confirmed Bookings", action: () => {} },
                    { icon: "📊", label: "My Performance", action: () => {} },
                    { icon: "🏨", label: "Hotel Catalogue", action: () => {} },
                  ].map(a => (
                    <button key={a.label} onClick={a.action} style={{
                      display: "flex", alignItems: "center", gap: "var(--space-md)",
                      padding: "0.65rem 0.75rem", borderRadius: "var(--radius-md)",
                      border: a.primary ? "none" : "1px solid var(--border)",
                      background: a.primary ? "var(--saffron)" : "transparent",
                      color: a.primary ? "white" : "var(--ink)",
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500,
                      transition: "all var(--transition)",
                    }}
                      onMouseEnter={e => { if (!a.primary) e.currentTarget.style.background = "var(--snow-warm)"; }}
                      onMouseLeave={e => { if (!a.primary) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span>{a.icon}</span> {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Summary */}
              <div className="card" style={{ padding: "var(--space-lg)", background: "linear-gradient(135deg, var(--pine), var(--deep-water))", border: "none" }}>
                <h4 style={{ fontFamily: "var(--font-display)", color: "white", marginBottom: "var(--space-md)" }}>This Month</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {[
                    { label: "Packages Sent", value: 14, max: 20, color: "var(--saffron-light)" },
                    { label: "Conversion Rate", value: 71, max: 100, color: "var(--glacier-light)", suffix: "%" },
                    { label: "Avg Package Value", value: "₹44K", isText: true },
                  ].map(m => (
                    <div key={m.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>{m.label}</span>
                        <span style={{ fontSize: "0.85rem", color: "white", fontWeight: 600 }}>
                          {m.isText ? m.value : `${m.value}${m.suffix || ""}`}
                        </span>
                      </div>
                      {!m.isText && (
                        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(m.value / m.max) * 100}%`, background: m.color, borderRadius: 2, transition: "width 1s ease" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div style={{
                padding: "var(--space-md)", borderRadius: "var(--radius-md)",
                background: "var(--saffron-pale)", border: "1px solid rgba(212,130,42,0.2)",
              }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--saffron)", marginBottom: "4px" }}>💡 Pro Tip</div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
                  Packages with Houseboat + Gulmarg combination have a 28% higher conversion rate this season.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duration Selection Modal */}
      {showDurationModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "var(--space-xl)", backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
          onClick={() => setShowDurationModal(false)}
        >
          <div style={{
            background: "white", borderRadius: "var(--radius-xl)", padding: "var(--space-xl)",
            maxWidth: "600px", width: "100%", boxShadow: "var(--shadow-xl)",
            animation: "fadeInUp 0.3s ease",
          }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Select Package Duration</h3>
                <p style={{ fontSize: "0.875rem" }}>Choose the number of nights for your Kashmir package</p>
              </div>
              <button onClick={() => setShowDurationModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--ink-muted)" }}>×</button>
            </div>

            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)" }}>
              {packageDurations.map((pkg, i) => (
                <button key={i} onClick={() => handleStartPackage(pkg)} style={{
                  background: selectedDuration === i ? "var(--pine)" : pkg.popular ? "var(--saffron-pale)" : "var(--snow-warm)",
                  color: selectedDuration === i ? "white" : "var(--ink)",
                  border: pkg.popular ? "1.5px solid var(--saffron)" : "1.5px solid transparent",
                  borderRadius: "var(--radius-lg)", padding: "var(--space-lg) var(--space-md)",
                  cursor: "pointer", textAlign: "center", transition: "all var(--transition)",
                  position: "relative", fontFamily: "inherit",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--pine)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = pkg.popular ? "var(--saffron-pale)" : "var(--snow-warm)"; e.currentTarget.style.color = "var(--ink)"; }}
                >
                  {pkg.popular && (
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--saffron)", color: "white", fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Popular</div>
                  )}
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 500, lineHeight: 1 }}>{pkg.nights}N</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", opacity: 0.7, marginBottom: "4px" }}>{pkg.days} Days</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 500, opacity: 0.6 }}>{pkg.description}</div>
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: "var(--space-md)", fontSize: "0.8rem" }}>
              🏔 All packages include Srinagar arrival & departure transfers
            </p>
          </div>
        </div>
      )}
    </div>
  );
}