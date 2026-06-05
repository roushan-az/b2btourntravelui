import Navbar from "../components/Navbar";

export default function QuotationPage({ navigate, onLogout, packageData }) {
  const pkg = packageData || { nights: 4, days: 5, label: "4N / 5D" };
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const quoteNo = `QT-2024-${Math.floor(1800 + Math.random() * 200)}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="agent" />

      <div style={{ paddingTop: "64px" }}>
        {/* Header Bar */}
        <div style={{ background: "var(--pine)", padding: "var(--space-lg) 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
              <button onClick={() => navigate("agent-dashboard")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: "var(--radius-full)", padding: "6px 14px", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>← Dashboard</button>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.3rem" }}>Quotation {quoteNo}</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>Generated {today}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-md)" }}>
              <button className="btn btn-ghost btn-sm">📧 Email Client</button>
              <button className="btn btn-ghost btn-sm">⬇ Download PDF</button>
              <button className="btn btn-primary btn-sm">✅ Confirm Booking</button>
            </div>
          </div>
        </div>

        {/* Quotation Document */}
        <div className="container" style={{ padding: "var(--space-xl) var(--space-xl)" }}>
          <div style={{
            background: "white", borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)", overflow: "hidden",
            maxWidth: "900px", margin: "0 auto",
            animation: "fadeInUp 0.5s ease",
          }}>
            {/* Quotation Header */}
            <div style={{
              background: "linear-gradient(135deg, var(--pine) 0%, var(--deep-water) 100%)",
              padding: "var(--space-2xl)",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-lg)" }}>
                  <div style={{ fontSize: "1.8rem" }}>⛰</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.4rem" }}>WanderKashmir</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>B2B Travel Portal</div>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2.5rem", fontWeight: 400, lineHeight: 1.1 }}>
                  Kashmir Package<br /><em style={{ color: "var(--saffron-light)" }}>Quotation</em>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", backdropFilter: "blur(8px)" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Quotation No.</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", fontFamily: "monospace" }}>{quoteNo}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "8px" }}>Valid till: {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                </div>
              </div>
            </div>

            {/* Package Summary Banner */}
            <div style={{
              background: "var(--saffron-pale)", padding: "var(--space-lg) var(--space-2xl)",
              display: "flex", gap: "var(--space-2xl)", flexWrap: "wrap",
              borderBottom: "1px solid rgba(212,130,42,0.15)",
            }}>
              {[
                { label: "Package", value: pkg.label || "4N / 5D" },
                { label: "Destination", value: "Kashmir" },
                { label: "Pax", value: "2 Adults" },
                { label: "Travel Date", value: "To Be Confirmed" },
                { label: "Prepared by", value: "Sunrise Travels" },
              ].map(i => (
                <div key={i.label}>
                  <div style={{ fontSize: "0.7rem", color: "var(--saffron)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{i.label}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--pine)", marginTop: "2px" }}>{i.value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "var(--space-2xl)" }}>
              {/* Day-wise Itinerary */}
              <div style={{ marginBottom: "var(--space-2xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                  <div style={{ width: 3, height: 28, background: "var(--saffron)", borderRadius: 2 }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Day-wise Itinerary</h3>
                </div>

                {[
                  { day: 1, title: "Arrival Srinagar — Dal Lake Sightseeing", desc: "Arrive at Srinagar International Airport. Our representative will meet & greet you. Transfer to hotel/houseboat. Check-in and freshen up. Afternoon shikara ride on the world-famous Dal Lake. Visit Mughal Gardens — Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Overnight at hotel in Srinagar.", overnight: "Srinagar" },
                  { day: 2, title: "Gulmarg — Gondola Ride & Snow Activities", desc: "After breakfast, drive to Gulmarg (56 km, approx. 2 hours), Asia's highest golf course and premier ski resort. Board the Gondola Phase 1 to Kongdoori and Phase 2 to Apharwat Peak (13,500 ft). Enjoy snow activities, skiing, and breathtaking mountain views. Return to Srinagar. Overnight in Srinagar.", overnight: "Srinagar" },
                  { day: 3, title: "Pahalgam — Valley of Shepherds", desc: "Drive to Pahalgam (95 km, approx. 3 hours), the Valley of Shepherds. En route visit Awantipora ruins. Arrive Pahalgam and visit Aru Valley, Betaab Valley, and Chandanwari. Enjoy pony rides and local market. Overnight in Pahalgam.", overnight: "Pahalgam" },
                  { day: 4, title: "Pahalgam to Srinagar — Shopping Day", desc: "Morning at leisure in Pahalgam. Drive back to Srinagar. Afternoon visit to handicraft emporiums — Kashmiri shawls, carpets, saffron, dry fruits, and papier-mâché products. Evening visit to local market at Lal Chowk. Overnight in Srinagar.", overnight: "Srinagar" },
                  { day: 5, title: "Departure — Fond Farewell", desc: "Sunrise Shikara ride on Dal Lake (optional). After breakfast, check-out from hotel. Transfer to Srinagar International Airport in time for your flight. Tour concludes with beautiful Kashmir memories to cherish forever.", overnight: null },
                ].slice(0, pkg.days || 5).map((day, i) => (
                  <div key={day.day} style={{
                    display: "flex", gap: "var(--space-lg)", marginBottom: "var(--space-xl)",
                    animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--pine) 0%, var(--glacier) 100%)",
                        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.9rem", boxShadow: "var(--shadow-sm)",
                      }}>D{day.day}</div>
                      {i < (pkg.days || 5) - 1 && <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: "4px", minHeight: "40px" }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: "var(--space-lg)" }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "var(--space-sm)" }}>{day.title}</h4>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: "var(--ink-muted)" }}>{day.desc}</p>
                      {day.overnight && (
                        <div style={{ marginTop: "var(--space-sm)", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "var(--snow-warm)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", color: "var(--pine)", fontWeight: 600 }}>
                          🌙 Overnight: {day.overnight}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inclusions / Exclusions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", marginBottom: "var(--space-2xl)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                    <div style={{ width: 3, height: 24, background: "#4caf50", borderRadius: 2 }} />
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>Inclusions</h4>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      "Accommodation in selected hotels/houseboats",
                      "Breakfast & Dinner (MAP Plan)",
                      "All transfers in private vehicle",
                      "Airport pickup & drop",
                      "Local sightseeing as per itinerary",
                      "Toll taxes, parking charges",
                      "Driver allowance & fuel",
                    ].map(inc => (
                      <div key={inc} style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "0.875rem" }}>
                        <span style={{ color: "#4caf50", flexShrink: 0, marginTop: "2px" }}>✓</span>
                        <span style={{ color: "var(--ink-muted)" }}>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                    <div style={{ width: 3, height: 24, background: "#ef5350", borderRadius: 2 }} />
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>Exclusions</h4>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      "Airfare / train fare",
                      "Gondola charges",
                      "Pony rides & adventure activities",
                      "Personal expenses & tips",
                      "Travel insurance",
                      "GST (5% extra on total)",
                      "Anything not in inclusions",
                    ].map(exc => (
                      <div key={exc} style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "0.875rem" }}>
                        <span style={{ color: "#ef5350", flexShrink: 0, marginTop: "2px" }}>✗</span>
                        <span style={{ color: "var(--ink-muted)" }}>{exc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Table */}
              <div style={{ marginBottom: "var(--space-2xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                  <div style={{ width: 3, height: 28, background: "var(--saffron)", borderRadius: 2 }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Package Cost</h3>
                </div>
                <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--pine)" }}>
                        {["Description", "Details", "Rate", "Amount"].map(h => (
                          <th key={h} style={{ padding: "var(--space-md) var(--space-lg)", textAlign: "left", color: "rgba(255,255,255,0.8)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { desc: "Accommodation", details: "4N / Hotels as selected", rate: "₹3,500 × 4N", amount: "₹14,000" },
                        { desc: "Vehicle", details: "Toyota Innova · 5 Days", rate: "₹3,500/day", amount: "₹17,500" },
                        { desc: "Sightseeing", details: "As per itinerary", rate: "Included", amount: "—" },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "var(--snow-warm)" }}>
                          <td style={{ padding: "var(--space-md) var(--space-lg)", fontWeight: 600, fontSize: "0.875rem" }}>{row.desc}</td>
                          <td style={{ padding: "var(--space-md) var(--space-lg)", color: "var(--ink-muted)", fontSize: "0.875rem" }}>{row.details}</td>
                          <td style={{ padding: "var(--space-md) var(--space-lg)", color: "var(--ink-muted)", fontSize: "0.875rem" }}>{row.rate}</td>
                          <td style={{ padding: "var(--space-md) var(--space-lg)", fontWeight: 600, fontSize: "0.875rem" }}>{row.amount}</td>
                        </tr>
                      ))}
                      <tr style={{ background: "var(--snow-warm)", borderTop: "2px solid var(--border)" }}>
                        <td colSpan="3" style={{ padding: "var(--space-md) var(--space-lg)", fontWeight: 600 }}>Sub-Total</td>
                        <td style={{ padding: "var(--space-md) var(--space-lg)", fontWeight: 600 }}>₹31,500</td>
                      </tr>
                      <tr style={{ background: "var(--snow-warm)" }}>
                        <td colSpan="3" style={{ padding: "0.5rem var(--space-lg)", color: "var(--ink-muted)", fontSize: "0.875rem" }}>GST @ 5%</td>
                        <td style={{ padding: "0.5rem var(--space-lg)", color: "var(--ink-muted)", fontSize: "0.875rem" }}>₹1,575</td>
                      </tr>
                      <tr style={{ background: "var(--pine)" }}>
                        <td colSpan="3" style={{ padding: "var(--space-md) var(--space-lg)", color: "white", fontWeight: 700, fontSize: "1rem" }}>TOTAL PACKAGE COST (Per Person)</td>
                        <td style={{ padding: "var(--space-md) var(--space-lg)", fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--saffron-light)", fontWeight: 500 }}>₹33,075</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Terms */}
              <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)", marginBottom: "var(--space-xl)", fontSize: "0.8rem", color: "var(--ink-muted)", lineHeight: 1.7 }}>
                <strong style={{ color: "var(--pine)" }}>Terms & Conditions:</strong> This quotation is valid for 7 days. Prices are subject to change during peak season. 25% advance required to confirm booking. Balance payable 14 days before travel. Cancellation charges apply as per policy.
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--pine)" }}>Sunrise Travels, Delhi</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>IATA Accredited · GST: 07XXXXX1234</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem" }}>⛰</div>
                  <div style={{ fontFamily: "var(--font-display)", color: "var(--pine)", fontSize: "0.9rem" }}>WanderKashmir</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--saffron)" }}>Kashmir — Paradise on Earth</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>wanderkashmir.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
