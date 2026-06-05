import { useState } from "react";
import Navbar from "../components/Navbar";
import { hotels, vehicles, itineraryBlocks, destinations } from "../data/mockData";

const NAV_ITEMS = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "destinations", icon: "📍", label: "Destinations" },
  { id: "itineraries", icon: "🗺", label: "Itineraries" },
  { id: "hotels", icon: "🏨", label: "Hotels" },
  { id: "vehicles", icon: "🚗", label: "Vehicles" },
  { id: "activities", icon: "🎯", label: "Activities" },
  { id: "agents", icon: "🧑‍💼", label: "Agents" },
  { id: "quotations", icon: "📋", label: "Quotations" },
  { id: "pricing", icon: "💰", label: "Pricing Rules" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const overviewStats = [
  { label: "Total Agents", value: "1,248", change: "+12", trend: "up", icon: "🧑‍💼", color: "var(--pine)" },
  { label: "Packages This Month", value: "3,412", change: "+8%", trend: "up", icon: "📦", color: "var(--saffron)" },
  { label: "Revenue (MTD)", value: "₹1.2Cr", change: "+22%", trend: "up", icon: "💰", color: "var(--glacier)" },
  { label: "Pending Quotations", value: "84", change: "-5", trend: "down", icon: "📋", color: "#7c3aed" },
];

function StatCard({ stat }) {
  return (
    <div className="card" style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
        <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>{stat.icon}</div>
        <div style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: stat.trend === "up" ? "#e8f5e9" : "#fff3f3", color: stat.trend === "up" ? "#2e7d32" : "#c62828", fontSize: "0.72rem", fontWeight: 700 }}>
          {stat.trend === "up" ? "↑" : "↓"} {stat.change}
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1 }}>{stat.value}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginTop: "4px" }}>{stat.label}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, onAdd, addLabel = "Add New" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-xl)", flexWrap: "wrap", gap: "var(--space-md)" }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "4px" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: "0.875rem" }}>{subtitle}</p>}
      </div>
      {onAdd && (
        <button className="btn btn-primary btn-sm" onClick={onAdd}>+ {addLabel}</button>
      )}
    </div>
  );
}

function TableRow({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--snow-warm)" : "white", cursor: onClick ? "pointer" : "default", transition: "background var(--transition)" }}
    >
      {children}
    </tr>
  );
}

const Td = ({ children, style = {} }) => (
  <td style={{ padding: "var(--space-md) var(--space-lg)", fontSize: "0.875rem", borderBottom: "1px solid var(--border)", verticalAlign: "middle", ...style }}>{children}</td>
);
const Th = ({ children }) => (
  <th style={{ padding: "var(--space-md) var(--space-lg)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)", textAlign: "left", borderBottom: "2px solid var(--border)", background: "var(--snow-warm)", whiteSpace: "nowrap" }}>{children}</th>
);

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xl)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}
      onClick={onClose}
    >
      <div style={{ background: "white", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: "640px", maxHeight: "85vh", overflow: "auto", boxShadow: "var(--shadow-xl)", animation: "fadeInUp 0.3s ease" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-xl)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", width: 32, height: 32, cursor: "pointer", fontSize: "1.1rem", color: "var(--ink-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "var(--space-xl)" }}>{children}</div>
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

// ─── Sub-sections ────────────────────────────────────────────────────────────

function OverviewSection() {
  const recentActivity = [
    { type: "package", agent: "Sharma Travels", action: "Created Kashmir Classic 4N", time: "2 min ago", icon: "📦" },
    { type: "agent", agent: "Admin", action: "Onboarded Punjab Travel World", time: "18 min ago", icon: "🧑‍💼" },
    { type: "quotation", agent: "Kerala Holidays Hub", action: "Quotation QT-2024-1891 confirmed", time: "1 hr ago", icon: "✅" },
    { type: "hotel", agent: "Admin", action: "Updated Hotel Pine Spring Pahalgam rates", time: "3 hrs ago", icon: "🏨" },
    { type: "package", agent: "Delhi Holidays", action: "Created Gulmarg Skiing 3N Package", time: "5 hrs ago", icon: "📦" },
  ];

  return (
    <div>
      <SectionHeader title="Dashboard Overview" subtitle="Real-time snapshot of platform activity" />
      <div className="grid-4" style={{ marginBottom: "var(--space-xl)" }}>
        {overviewStats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "var(--space-xl)" }}>
        {/* Activity Feed */}
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Live Activity Feed</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", paddingBottom: "var(--space-md)", borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--snow-warm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>{a.action}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.agent} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div className="card" style={{ padding: "var(--space-xl)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "var(--space-lg)" }}>Top Package Durations</h4>
            {[
              { label: "4N / 5D — Kashmir Classic", pct: 38, color: "var(--saffron)" },
              { label: "5N / 6D — Explorer", pct: 28, color: "var(--pine)" },
              { label: "3N / 4D — Quick Escape", pct: 19, color: "var(--glacier)" },
              { label: "7N / 8D — Immersion", pct: 15, color: "#7c3aed" },
            ].map(d => (
              <div key={d.label} style={{ marginBottom: "var(--space-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>{d.label}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink)" }}>{d.pct}%</span>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: 3, transition: "width 1.2s ease" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "var(--space-xl)", background: "linear-gradient(135deg, var(--pine), var(--deep-water))", border: "none" }}>
            <h4 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.1rem", marginBottom: "var(--space-lg)" }}>Revenue by Season</h4>
            {[
              { label: "Summer (Apr–Sep)", value: "₹72L", pct: 65 },
              { label: "Winter (Oct–Mar)", value: "₹38L", pct: 35 },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: "var(--space-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{s.value}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: "var(--saffron-light)", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DestinationsSection() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", region: "", description: "", highlights: "", active: true });

  return (
    <div>
      <SectionHeader title="Destination Management" subtitle="Add and manage Kashmir destinations available for package building" onAdd={() => setShowModal(true)} addLabel="Add Destination" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Destination</Th>
              <Th>Region</Th>
              <Th>Hotels</Th>
              <Th>Itineraries</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <TableRow key={d.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <img src={d.image} alt={d.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                    <span style={{ fontWeight: 600 }}>{d.name}</span>
                  </div>
                </Td>
                <Td style={{ color: "var(--ink-muted)" }}>{d.region}</Td>
                <Td>{hotels.filter(h => h.destination === d.slug).length}</Td>
                <Td>{itineraryBlocks.filter(i => i.overnight === d.slug || i.from === d.slug).length}</Td>
                <Td><span className="badge badge-success">Active</span></Td>
                <Td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
                    <button style={{ background: "#fff3f3", border: "1px solid #ffcdd2", color: "#c62828", padding: "4px 10px", borderRadius: "var(--radius-full)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>Delete</button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add New Destination" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <FormRow label="Destination Name"><input className="form-input" placeholder="e.g., Doodhpathri" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormRow>
            <FormRow label="Region / District"><input className="form-input" placeholder="e.g., Budgam" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} /></FormRow>
            <FormRow label="Description"><textarea className="form-input" rows={3} placeholder="Brief description for agents..." style={{ resize: "vertical" }} /></FormRow>
            <FormRow label="Key Highlights (comma separated)"><input className="form-input" placeholder="e.g., Meadows, Waterfall, Pine Forest" /></FormRow>
            <FormRow label="Hero Image URL"><input className="form-input" placeholder="https://..." /></FormRow>
            <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-md)" }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Save Destination</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ItinerariesSection() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <SectionHeader title="Itinerary Block Management" subtitle="Create reusable day-wise itinerary options shown to agents during package building" onAdd={() => setShowModal(true)} addLabel="Add Itinerary Block" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Day #</Th>
              <Th>Departs From</Th>
              <Th>Overnight</Th>
              <Th>Highlights</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {itineraryBlocks.map((b) => (
              <TableRow key={b.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <span style={{ fontSize: "1.2rem" }}>{b.icon}</span>
                    <span style={{ fontWeight: 600, maxWidth: 220 }}>{b.title}</span>
                  </div>
                </Td>
                <Td><span className="badge badge-forest">Day {b.day}</span></Td>
                <Td style={{ color: "var(--ink-muted)", textTransform: "capitalize" }}>{b.from}</Td>
                <Td>
                  {b.overnight ? (
                    <span style={{ color: "var(--pine)", fontWeight: 600, fontSize: "0.8rem", textTransform: "capitalize" }}>🌙 {b.overnight}</span>
                  ) : (
                    <span style={{ color: "var(--saffron)", fontSize: "0.8rem" }}>✈ Departure</span>
                  )}
                </Td>
                <Td>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {b.highlights.slice(0, 2).map(h => (
                      <span key={h} style={{ fontSize: "0.65rem", background: "var(--snow-warm)", padding: "2px 7px", borderRadius: "var(--radius-full)", color: "var(--ink-muted)" }}>{h}</span>
                    ))}
                  </div>
                </Td>
                <Td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
                    <button style={{ background: "#fff3f3", border: "1px solid #ffcdd2", color: "#c62828", padding: "4px 10px", borderRadius: "var(--radius-full)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>Delete</button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add Itinerary Block" onClose={() => setShowModal(false)}>
          <div>
            <FormRow label="Itinerary Title"><input className="form-input" placeholder="e.g., Arrival Srinagar — Dal Lake Sightseeing" /></FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
              <div className="form-group">
                <label className="form-label">Day Number</label>
                <select className="form-select">
                  {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d}>Day {d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Departs From</label>
                <select className="form-select">
                  <option>arrival</option>
                  <option>srinagar</option>
                  <option>pahalgam</option>
                  <option>gulmarg</option>
                  <option>sonmarg</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Overnight At</label>
                <select className="form-select">
                  <option>srinagar</option>
                  <option>pahalgam</option>
                  <option>gulmarg</option>
                  <option>sonmarg</option>
                  <option>departure</option>
                </select>
              </div>
            </div>
            <FormRow label="Description"><textarea className="form-input" rows={4} placeholder="Full day description shown to agents..." style={{ resize: "vertical" }} /></FormRow>
            <FormRow label="Highlights (comma separated)"><input className="form-input" placeholder="Dal Lake, Mughal Gardens, Shikara Ride" /></FormRow>
            <FormRow label="Sightseeing Points"><input className="form-input" placeholder="Nishat Bagh, Shalimar Bagh, Chashme Shahi" /></FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <FormRow label="Duration"><input className="form-input" placeholder="Full Day / Half Day" /></FormRow>
              <FormRow label="Icon (emoji)"><input className="form-input" placeholder="🏔" maxLength={2} /></FormRow>
            </div>
            <FormRow label="Image URL"><input className="form-input" placeholder="https://images.unsplash.com/..." /></FormRow>
            <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-md)" }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Save Itinerary Block</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function HotelsSection() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <SectionHeader title="Hotel Management" subtitle="Manage hotels, room types, meal plans and seasonal pricing" onAdd={() => setShowModal(true)} addLabel="Add Hotel" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Hotel</Th>
              <Th>Destination</Th>
              <Th>Category</Th>
              <Th>Room Types</Th>
              <Th>Base Rate (CP)</Th>
              <Th>Rating</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <TableRow key={h.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <img src={h.image} alt={h.name} style={{ width: 44, height: 36, objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{h.name}</span>
                  </div>
                </Td>
                <Td style={{ textTransform: "capitalize" }}>{h.destination}</Td>
                <Td><span className="badge badge-saffron" style={{ fontSize: "0.65rem" }}>{h.category}</span></Td>
                <Td>{h.roomTypes.length} types</Td>
                <Td style={{ fontWeight: 600 }}>₹{h.roomTypes[0].cp.toLocaleString("en-IN")}</Td>
                <Td>
                  <span style={{ color: "var(--saffron)", fontWeight: 700 }}>★ {h.rating}</span>
                  <span style={{ color: "var(--ink-muted)", fontSize: "0.75rem" }}> ({h.reviews})</span>
                </Td>
                <Td><span className="badge badge-success">Active</span></Td>
                <Td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Rates</button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add New Hotel" onClose={() => setShowModal(false)}>
          <FormRow label="Hotel Name"><input className="form-input" placeholder="e.g., Hotel Grand Palace" /></FormRow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <select className="form-select">
                {destinations.map(d => <option key={d.id} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select">
                <option>5 Star Deluxe</option>
                <option>5 Star</option>
                <option>4 Star</option>
                <option>3 Star</option>
                <option>Heritage Hotel</option>
                <option>Premium Houseboat</option>
                <option>Budget Houseboat</option>
              </select>
            </div>
          </div>
          <FormRow label="Description"><textarea className="form-input" rows={3} style={{ resize: "vertical" }} placeholder="Brief description..." /></FormRow>
          <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--pine)", marginBottom: "var(--space-md)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Room Rates (EP / CP / MAP / AP) per night</div>
            {["Deluxe Room", "Superior Room"].map(rt => (
              <div key={rt} style={{ marginBottom: "var(--space-md)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "var(--space-sm)" }}>{rt}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-sm)" }}>
                  {["EP", "CP", "MAP", "AP"].map(mp => (
                    <div key={mp} className="form-group">
                      <label className="form-label" style={{ fontSize: "0.65rem" }}>{mp}</label>
                      <input className="form-input" placeholder="₹0" type="number" style={{ fontSize: "0.8rem", padding: "0.5rem 0.75rem" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <FormRow label="Amenities (comma separated)"><input className="form-input" placeholder="Spa, Pool, Restaurant, WiFi, Lake View" /></FormRow>
          <FormRow label="Hotel Image URL"><input className="form-input" placeholder="https://..." /></FormRow>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary">Save Hotel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function VehiclesSection() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <SectionHeader title="Vehicle Management" subtitle="Manage fleet, rates, and vehicle availability by season" onAdd={() => setShowModal(true)} addLabel="Add Vehicle" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Vehicle Type</Th>
              <Th>Models</Th>
              <Th>Capacity</Th>
              <Th>Per Day Rate</Th>
              <Th>Per Km Rate</Th>
              <Th>Winter Surcharge</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <TableRow key={v.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <span style={{ fontSize: "1.4rem" }}>{v.image}</span>
                    <span style={{ fontWeight: 700 }}>{v.type}</span>
                  </div>
                </Td>
                <Td style={{ color: "var(--ink-muted)", fontSize: "0.8rem", maxWidth: 180 }}>{v.models}</Td>
                <Td>{v.capacity}</Td>
                <Td style={{ fontWeight: 600 }}>₹{v.perDayRate.toLocaleString("en-IN")}</Td>
                <Td>₹{v.perKmRate}/km</Td>
                <Td style={{ color: "var(--saffron)", fontWeight: 600 }}>+₹{v.seasonal.winter}</Td>
                <Td><span className="badge badge-success">Active</span></Td>
                <Td>
                  <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add Vehicle" onClose={() => setShowModal(false)}>
          <FormRow label="Vehicle Type"><input className="form-input" placeholder="e.g., Innova Crysta" /></FormRow>
          <FormRow label="Models / Variants"><input className="form-input" placeholder="e.g., Toyota Innova Crysta 7-seater" /></FormRow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <FormRow label="Pax Capacity"><input className="form-input" placeholder="e.g., 7 Pax" /></FormRow>
            <FormRow label="Luggage Capacity"><input className="form-input" placeholder="e.g., 5 Medium Bags" /></FormRow>
          </div>
          <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--pine)", marginBottom: "var(--space-md)" }}>Pricing</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
              <FormRow label="Per Day Rate (₹)"><input className="form-input" placeholder="3500" type="number" /></FormRow>
              <FormRow label="Per Km Rate (₹)"><input className="form-input" placeholder="20" type="number" /></FormRow>
              <FormRow label="Airport Transfer"><input className="form-input" placeholder="1400" type="number" /></FormRow>
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, margin: "var(--space-sm) 0", color: "var(--ink-muted)" }}>Seasonal Surcharges (₹ added to base rate)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
              <FormRow label="Winter Surcharge"><input className="form-input" placeholder="800" type="number" /></FormRow>
              <FormRow label="Peak Season"><input className="form-input" placeholder="1200" type="number" /></FormRow>
              <FormRow label="New Year"><input className="form-input" placeholder="2000" type="number" /></FormRow>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary">Save Vehicle</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AgentsSection() {
  const [showModal, setShowModal] = useState(false);
  const agents = [
    { name: "Sharma Tours & Travels", city: "Delhi", email: "sharma@gmail.com", packages: 145, revenue: "₹62L", markup: "15%", status: "active" },
    { name: "Kerala Holidays Hub", city: "Kochi", email: "priya@keralahols.com", packages: 89, revenue: "₹38L", markup: "12%", status: "active" },
    { name: "Punjab Travel World", city: "Chandigarh", email: "aman@ptworld.com", packages: 212, revenue: "₹91L", markup: "18%", status: "active" },
    { name: "Sunrise Travels", city: "Delhi", email: "demo@wanderkashmir.com", packages: 14, revenue: "₹6.2L", markup: "10%", status: "active" },
    { name: "Mumbai Tours", city: "Mumbai", email: "info@mumbaitors.com", packages: 0, revenue: "₹0", markup: "10%", status: "pending" },
  ];

  return (
    <div>
      <SectionHeader title="Agent Management" subtitle="Onboard and manage sub-agents with custom pricing and access controls" onAdd={() => setShowModal(true)} addLabel="Add Agent" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Agency</Th>
              <Th>City</Th>
              <Th>Email</Th>
              <Th>Packages</Th>
              <Th>Revenue</Th>
              <Th>Markup</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a, i) => (
              <TableRow key={i}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--pine), var(--glacier))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                      {a.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{a.name}</span>
                  </div>
                </Td>
                <Td style={{ color: "var(--ink-muted)" }}>{a.city}</Td>
                <Td style={{ color: "var(--ink-muted)", fontSize: "0.8rem" }}>{a.email}</Td>
                <Td style={{ fontWeight: 600 }}>{a.packages}</Td>
                <Td style={{ fontWeight: 600, color: "var(--pine)" }}>{a.revenue}</Td>
                <Td><span className="badge badge-saffron">{a.markup}</span></Td>
                <Td>
                  <span className={`badge ${a.status === "active" ? "badge-success" : "badge-saffron"}`}>
                    {a.status === "active" ? "Active" : "Pending"}
                  </span>
                </Td>
                <Td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Pricing</button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Onboard New Agent" onClose={() => setShowModal(false)}>
          <FormRow label="Agency / Company Name"><input className="form-input" placeholder="e.g., ABC Tours & Travels" /></FormRow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <FormRow label="Contact Person Name"><input className="form-input" placeholder="Full Name" /></FormRow>
            <FormRow label="City / Location"><input className="form-input" placeholder="e.g., Mumbai" /></FormRow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <FormRow label="Email Address"><input className="form-input" type="email" placeholder="agent@company.com" /></FormRow>
            <FormRow label="Phone Number"><input className="form-input" placeholder="+91 98000 00000" /></FormRow>
          </div>
          <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--pine)", marginBottom: "var(--space-md)" }}>Pricing & Access Settings</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
              <FormRow label="Markup Type">
                <select className="form-select">
                  <option>Percentage (%)</option>
                  <option>Fixed Amount (₹)</option>
                </select>
              </FormRow>
              <FormRow label="Markup Value"><input className="form-input" placeholder="15" type="number" /></FormRow>
              <FormRow label="Price Visibility">
                <select className="form-select">
                  <option>Total Only</option>
                  <option>Full Breakdown</option>
                </select>
              </FormRow>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary">Create Agent Account</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function QuotationsSection() {
  const quotations = [
    { id: "QT-2024-1891", agent: "Sunrise Travels", client: "Mr. & Mrs. Kapoor", pax: 2, nights: "4N", destination: "Kashmir Classic", amount: "₹66,150", status: "sent", date: "31 May 2024" },
    { id: "QT-2024-1890", agent: "Sharma Tours", client: "Mehta Family", pax: 6, nights: "5N", destination: "Kashmir Explorer", amount: "₹1,86,000", status: "confirmed", date: "31 May 2024" },
    { id: "QT-2024-1889", agent: "Punjab Travel World", client: "Singh Group", pax: 12, nights: "3N", destination: "Quick Escape", amount: "₹2,10,000", status: "pending", date: "30 May 2024" },
    { id: "QT-2024-1888", agent: "Kerala Holidays Hub", client: "Ms. Trivedi", pax: 1, nights: "7N", destination: "Kashmir Immersion", amount: "₹62,000", status: "draft", date: "29 May 2024" },
    { id: "QT-2024-1887", agent: "Sharma Tours", client: "Joshi Corporate", pax: 20, nights: "4N", destination: "MICE Kashmir", amount: "₹8,40,000", status: "confirmed", date: "28 May 2024" },
  ];

  const statusConfig = {
    draft: { bg: "#f5f5f5", color: "#666" },
    sent: { bg: "#e3f2fd", color: "#1565c0" },
    confirmed: { bg: "#e8f5e9", color: "#2e7d32" },
    pending: { bg: "#fff3e0", color: "#e65100" },
  };

  return (
    <div>
      <SectionHeader title="All Quotations" subtitle="View and manage quotations created by all agents" />
      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)", flexWrap: "wrap" }}>
        <input className="form-input" placeholder="Search by client, ID, agent..." style={{ flex: 1, minWidth: 200, maxWidth: 320 }} />
        <select className="form-select" style={{ width: "auto" }}>
          <option>All Statuses</option>
          <option>Draft</option>
          <option>Sent</option>
          <option>Confirmed</option>
          <option>Pending</option>
        </select>
        <input className="form-input" type="date" style={{ width: "auto" }} />
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <Th>Quote ID</Th>
              <Th>Agent</Th>
              <Th>Client</Th>
              <Th>Pax</Th>
              <Th>Package</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => {
              const sc = statusConfig[q.status];
              return (
                <TableRow key={q.id}>
                  <Td style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--pine)", fontWeight: 700 }}>{q.id}</Td>
                  <Td style={{ fontWeight: 500, fontSize: "0.85rem" }}>{q.agent}</Td>
                  <Td>{q.client}</Td>
                  <Td>{q.pax} pax</Td>
                  <Td style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>{q.nights} · {q.destination}</Td>
                  <Td style={{ fontWeight: 700, color: "var(--pine)" }}>{q.amount}</Td>
                  <Td>
                    <span style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: sc.bg, color: sc.color, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {q.status}
                    </span>
                  </Td>
                  <Td style={{ color: "var(--ink-muted)", fontSize: "0.78rem" }}>{q.date}</Td>
                  <Td>
                    <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>View</button>
                  </Td>
                </TableRow>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div>
      <SectionHeader title="Pricing Rules & Seasonal Rates" subtitle="Set seasonal pricing, surcharges, and markup policies for all agents" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        {/* Seasonal pricing */}
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Seasonal Rate Multipliers</h4>
          {[
            { season: "Peak Summer (Apr–Jun)", multiplier: "1.30", color: "var(--saffron)" },
            { season: "Regular Summer (Jul–Sep)", multiplier: "1.00", color: "var(--glacier)" },
            { season: "Autumn (Oct–Nov)", multiplier: "1.15", color: "#7c3aed" },
            { season: "Winter (Dec–Feb)", multiplier: "1.20", color: "var(--deep-water)" },
            { season: "New Year (31 Dec–2 Jan)", multiplier: "1.60", color: "#c62828" },
            { season: "Long Weekends", multiplier: "1.25", color: "var(--pine)" },
          ].map(s => (
            <div key={s.season} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md) 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{s.season}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: s.color, fontWeight: 500 }}>{s.multiplier}×</span>
                <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>Edit</button>
              </div>
            </div>
          ))}
        </div>

        {/* Markup rules */}
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Default Markup Rules</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-muted)", marginBottom: "var(--space-md)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Default Agent Markup</div>
              <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                <input className="form-input" defaultValue="15" type="number" style={{ width: 80 }} />
                <span style={{ color: "var(--ink-muted)" }}>%</span>
                <button className="btn btn-primary btn-sm">Update</button>
              </div>
            </div>
            <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-muted)", marginBottom: "var(--space-md)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Price Visibility (Default)</div>
              <select className="form-select">
                <option>Total Package Cost Only</option>
                <option>Full Cost Breakdown</option>
              </select>
            </div>
            <div style={{ background: "var(--snow-warm)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-muted)", marginBottom: "var(--space-md)", textTransform: "uppercase", letterSpacing: "0.06em" }}>GST Configuration</div>
              <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                <input className="form-input" defaultValue="5" type="number" style={{ width: 80 }} />
                <span style={{ color: "var(--ink-muted)" }}>% GST on total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

export default function AdminDashboard({ navigate, onLogout }) {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection />;
      case "destinations": return <DestinationsSection />;
      case "itineraries": return <ItinerariesSection />;
      case "hotels": return <HotelsSection />;
      case "vehicles": return <VehiclesSection />;
      case "agents": return <AgentsSection />;
      case "quotations": return <QuotationsSection />;
      case "pricing": return <PricingSection />;
      case "activities": return (
        <div>
          <SectionHeader title="Activities & Sightseeing" subtitle="Manage optional activities shown to agents during package building" onAdd={() => {}} addLabel="Add Activity" />
          <div className="card" style={{ padding: "var(--space-2xl)", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>🎯</div>
            <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-sm)" }}>Activities Panel</h4>
            <p style={{ fontSize: "0.875rem", maxWidth: 400, margin: "0 auto" }}>Manage Gondola rides, Shikara rides, Pony rides, ATV activities, snow sledging, and more from this panel.</p>
          </div>
        </div>
      );
      case "settings": return (
        <div>
          <SectionHeader title="Platform Settings" subtitle="Configure portal-wide settings and preferences" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
            {[
              { title: "General Settings", items: ["Portal Name", "Default Currency", "Default Language", "Contact Email"] },
              { title: "Booking Settings", items: ["Min Advance Booking Days", "Max Package Duration", "Cancellation Policy", "Payment Terms"] },
            ].map(section => (
              <div key={section.title} className="card" style={{ padding: "var(--space-xl)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>{section.title}</h4>
                {section.items.map(item => (
                  <div key={item} className="form-group" style={{ marginBottom: "var(--space-md)" }}>
                    <label className="form-label">{item}</label>
                    <input className="form-input" placeholder={item} />
                  </div>
                ))}
                <button className="btn btn-primary btn-sm">Save Changes</button>
              </div>
            ))}
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)", display: "flex", flexDirection: "column" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="admin" />

      <div style={{ display: "flex", flex: 1, paddingTop: "64px" }}>
        {/* Sidebar */}
        <aside style={{
          width: 240, flexShrink: 0,
          background: "var(--pine)",
          position: "fixed", top: 64, left: 0, bottom: 0,
          overflowY: "auto", zIndex: 200,
          display: "flex", flexDirection: "column",
        }}>
          {/* Brand */}
          <div style={{ padding: "var(--space-xl) var(--space-lg)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Admin Panel</div>
            <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Super Administrator</div>
          </div>

          {/* Nav */}
          <nav style={{ padding: "var(--space-md) var(--space-sm)", flex: 1 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
                display: "flex", alignItems: "center", gap: "var(--space-md)",
                width: "100%", padding: "0.65rem var(--space-md)",
                borderRadius: "var(--radius-md)", border: "none",
                background: activeSection === item.id ? "rgba(255,255,255,0.12)" : "transparent",
                color: activeSection === item.id ? "white" : "rgba(255,255,255,0.55)",
                cursor: "pointer", fontSize: "0.875rem", fontWeight: activeSection === item.id ? 600 : 400,
                fontFamily: "inherit", textAlign: "left", marginBottom: "2px",
                transition: "all var(--transition)",
                borderLeft: activeSection === item.id ? "3px solid var(--saffron)" : "3px solid transparent",
              }}
                onMouseEnter={e => { if (activeSection !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding: "var(--space-lg)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={onLogout} style={{
              display: "flex", alignItems: "center", gap: "var(--space-md)", width: "100%",
              padding: "0.65rem var(--space-md)", borderRadius: "var(--radius-md)",
              border: "none", background: "transparent", color: "rgba(255,255,255,0.4)",
              cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit",
              transition: "all var(--transition)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,0,0,0.1)"; e.currentTarget.style.color = "#ff6b6b"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: 240, flex: 1, padding: "var(--space-xl)", minWidth: 0 }}>
          <div style={{ animation: "fadeInUp 0.4s ease" }} key={activeSection}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
