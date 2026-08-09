import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { packageDurations } from "../data/mockData";

const statusConfig = {
  draft: { color: "#8a8a8a", bg: "#f5f5f5", label: "Draft" },
  sent: { color: "#1565c0", bg: "#e3f2fd", label: "Sent" },
  confirmed: { color: "#2e7d32", bg: "#e8f5e9", label: "Confirmed" },
  pending: { color: "#e65100", bg: "#fff3e0", label: "Pending" },
};

export default function AgentDashboard({ navigate, onLogout }) {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [recentQuotations, setRecentQuotations] = useState([]);
  
  // NEW: Clean inline states for deleting
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const data = await api.quotations.list();
        setRecentQuotations(Array.isArray(data) ? data : (data?.items || data?.data || []));
      } catch (err) {
        console.error("Failed to load quotations:", err);
      }
    };
    loadQuotations();
  }, []);

  const handleStartPackage = (pkg) => {
    setShowDurationModal(false);
    navigate("package-builder", { nights: pkg.nights, days: pkg.days, label: pkg.label, description: pkg.description });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    setDeleteError(""); // Clear old errors
    setDeletingId(id);  // Show loading state on button
    
    try {
      await api.quotations.delete(id);
      setRecentQuotations(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      setDeleteError("Unable to delete quotation. It may have already been removed or you lack permission.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="agent" />

      <div style={{ paddingTop: "64px" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, var(--pine) 0%, var(--deep-water) 100%)", padding: "var(--space-2xl) 0 var(--space-xl)" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-md)" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Welcome back</p>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2rem", fontWeight: 500 }}>Agent Portal</h2>
                <div style={{ display: "flex", gap: "var(--space-lg)", marginTop: "var(--space-md)", flexWrap: "wrap" }}>
                  {[
                    { label: "Packages This Month", value: "0" },
                    { label: "Total Revenue", value: "₹0" },
                    { label: "Pending Quotations", value: recentQuotations.length.toString() },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontFamily: "var(--font-display)", color: "var(--saffron-light)", fontSize: "1.6rem", fontWeight: 500 }}>{s.value}</span>
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => setShowDurationModal(true)} style={{ flexShrink: 0 }}>
                + Create New Package
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container" style={{ padding: "var(--space-xl) var(--space-xl)" }}>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-xl)" }}>

            {/* Recent Quotations List */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Recent Quotations</h3>
              </div>

              {/* NEW: Inline Error Banner */}
              {deleteError && (
                <div style={{ padding: "12px 16px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
                  {deleteError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {recentQuotations.length > 0 ? recentQuotations.map((q) => {
                  const sc = statusConfig[q.status?.toLowerCase()] || statusConfig.draft;
                  const isDeleting = deletingId === q.id;
                  
                  return (
                    <div key={q.id} className="card" style={{ padding: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)", cursor: "pointer", transition: "transform 0.2s", opacity: isDeleting ? 0.6 : 1 }} onClick={() => navigate("quotation", q)}>
                      <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--snow-warm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>📋</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "2px" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)" }}>{q.client_name}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>{q.id.split('-')[0]} · {q.package_label}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--pine)", fontWeight: 500 }}>
                          ₹{q.total_cost?.toLocaleString("en-IN")}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ padding: "2px 10px", borderRadius: "var(--radius-full)", background: sc.bg, color: sc.color, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>{sc.label}</span>
                          
                          {/* Delete Button: Only visible if DRAFT */}
                          {(!q.status || q.status.toUpperCase() === "DRAFT") && (
                            <button 
                              onClick={(e) => handleDelete(e, q.id)} 
                              disabled={isDeleting}
                              style={{ 
                                background: "none", color: "#b91c1c", border: "1px solid #fca5a5", 
                                borderRadius: "4px", padding: "4px 8px", fontSize: "0.75rem", 
                                fontWeight: "600", cursor: isDeleting ? "wait" : "pointer",
                                transition: "all 0.2s"
                              }}>
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                   <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--ink-muted)", background: "white", borderRadius: "var(--radius-lg)" }}>
                      No quotations found in the database. Create a new package to get started!
                   </div>
                )}
              </div>
            </div>

            {/* Side panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              <div className="card" style={{ padding: "var(--space-lg)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-md)" }}>Quick Actions</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  <button onClick={() => setShowDurationModal(true)} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", padding: "0.65rem 0.75rem", borderRadius: "var(--radius-md)", border: "none", background: "var(--saffron)", color: "white", cursor: "pointer", textAlign: "left", fontSize: "0.875rem", fontWeight: 500 }}>
                    <span>➕</span> New Kashmir Package
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Duration Modal */}
      {showDurationModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xl)" }} onClick={() => setShowDurationModal(false)}>
          <div style={{ background: "white", borderRadius: "var(--radius-xl)", padding: "var(--space-xl)", maxWidth: "600px", width: "100%", boxShadow: "var(--shadow-xl)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Select Package Duration</h3>
              </div>
              <button onClick={() => setShowDurationModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--ink-muted)" }}>×</button>
            </div>

            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)" }}>
              {packageDurations.map((pkg, i) => (
                <button key={i} onClick={() => handleStartPackage(pkg)} style={{ background: "var(--snow-warm)", border: "1.5px solid transparent", borderRadius: "var(--radius-lg)", padding: "var(--space-lg) var(--space-md)", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 500, lineHeight: 1 }}>{pkg.nights}N</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", opacity: 0.7, marginBottom: "4px" }}>{pkg.days} Days</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}