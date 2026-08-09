import { useState, useEffect } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const NAV_ITEMS = [
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

// ─── Shared UI Components ────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, onAdd, addLabel = "Add New" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-xl)", flexWrap: "wrap", gap: "var(--space-md)" }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "4px" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>{subtitle}</p>}
      </div>
      {onAdd && <button className="btn btn-primary btn-sm" onClick={onAdd}>+ {addLabel}</button>}
    </div>
  );
}

function TableRow({ children, onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        background: hovered ? "var(--snow-warm)" : "white", 
        transition: "background var(--transition)",
        cursor: onClick ? "pointer" : "default",
        ...style 
      }}
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xl)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: "640px", maxHeight: "85vh", overflow: "auto", boxShadow: "var(--shadow-xl)", animation: "fadeInUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
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

function ConfirmActionModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes, Delete", isProcessing }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xl)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: "420px", padding: "var(--space-2xl)", textAlign: "center", boxShadow: "var(--shadow-2xl)", animation: "fadeInUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>⚠️</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "var(--space-sm)", color: "var(--ink)" }}>{title}</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--ink-muted)", marginBottom: "var(--space-xl)", lineHeight: 1.6 }}>{message}</p>
        
        <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center" }}>
          <button className="btn btn-outline" onClick={onClose} disabled={isProcessing}>Cancel</button>
          <button className="btn btn-primary" style={{ background: "#c62828", borderColor: "#c62828" }} onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Destinations Section ───────────────────────────────────────────────────

function DestinationsSection() {
  const [showModal, setShowModal] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState(""); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", region: "", is_active: true });

  const fetchDestinations = async () => {
    try {
      const data = await api.destinations.list();
      setDestinations(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
    }
  };

  useEffect(() => { fetchDestinations(); }, []);

  const handleSave = async () => {
    setErrorMsg(""); 
    if (!formData.name || !formData.region) return setErrorMsg("Please fill all required fields.");
    
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        region: formData.region,
        is_active: true
      };
      
      await api.destinations.create(payload);
      setShowModal(false);
      setFormData({ name: "", region: "", is_active: true });
      fetchDestinations();
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred."); 
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.destinations.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchDestinations();
    } catch (err) {
      setDeleteTarget(null);
      console.error("Error deleting destination: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Destination Management" onAdd={() => { setShowModal(true); setErrorMsg(""); }} addLabel="Add Destination" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>Destination</Th><Th>Region</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {destinations.map((d) => (
              <TableRow key={d.id}>
                <Td style={{ fontWeight: 600 }}>{d.name}</Td>
                <Td>{d.region}</Td>
                <Td><span className="badge badge-success">Active</span></Td>
                <Td><button onClick={() => setDeleteTarget({ id: d.id, title: d.name })} className="btn btn-outline btn-sm" style={{ borderColor: "#ffcdd2", color: "#c62828" }}>Delete</button></Td>
              </TableRow>
            ))}
            {destinations.length === 0 && <tr><Td colSpan="4" style={{textAlign:"center", padding:"var(--space-xl)", color:"var(--ink-muted)"}}>No destinations found.</Td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmActionModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Destination"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isProcessing={isDeleting}
      />

      {showModal && (
        <Modal title="Add Destination" onClose={() => setShowModal(false)}>
          {errorMsg && (
            <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span>⚠</span><span>{errorMsg}</span>
            </div>
          )}
          <FormRow label="Destination Name">
            <input className="form-input" placeholder="e.g., Srinagar" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </FormRow>
          <FormRow label="Region">
            <input className="form-input" placeholder="e.g., Kashmir Valley" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
          </FormRow>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-md)" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Destination"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Itineraries Section ────────────────────────────────────────────────────

function ItinerariesSection() {
  const [showModal, setShowModal] = useState(false);
  const [itineraryBlocks, setItineraryBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({ title: "", day_number: 1, departs_from: "arrival", overnight_slug: "srinagar", description: "", highlights: "", icon: "🏔" });

  const fetchItineraries = async () => {
    try {
      const data = await api.itineraries.list();
      setItineraryBlocks(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { 
      console.error("Failed to load itineraries:", err); 
    }
  };

  useEffect(() => { fetchItineraries(); }, []);

  const handleSave = async () => {
    setErrorMsg("");
    if (!formData.title || !formData.description) return setErrorMsg("Title and Description are required.");
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        highlights: formData.highlights.split(',').map(h => h.trim()).filter(h => h),
        day_number: parseInt(formData.day_number)
      };
      await api.itineraries.create(payload);
      setShowModal(false);
      setFormData({ title: "", day_number: 1, departs_from: "arrival", overnight_slug: "srinagar", description: "", highlights: "", icon: "🏔" });
      fetchItineraries();
    } catch (err) { 
      setErrorMsg(err.message || "An unexpected error occurred."); 
    } finally { 
      setLoading(false); 
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { 
      await api.itineraries.delete(deleteTarget.id); 
      setDeleteTarget(null);
      fetchItineraries(); 
    } catch (err) { 
      setDeleteTarget(null);
      console.error("Error deleting itinerary: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Itinerary Block Management" subtitle="Create reusable day-wise itinerary options" onAdd={() => { setShowModal(true); setErrorMsg(""); }} addLabel="Add Itinerary Block" />
      
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Title</Th><Th>Day #</Th><Th>Departs From</Th><Th>Overnight</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {(itineraryBlocks || []).map((b) => (
                <TableRow key={b.id}>
                  <Td><div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}><span style={{ fontSize: "1.2rem" }}>{b.icon}</span><span style={{ fontWeight: 600 }}>{b.title}</span></div></Td>
                  <Td><span className="badge badge-forest">Day {b.day_number}</span></Td>
                  <Td style={{ textTransform: "capitalize" }}>{b.departs_from}</Td>
                  <Td>{b.overnight_slug ? <span style={{ color: "var(--pine)", fontWeight: 600 }}>🌙 {b.overnight_slug}</span> : <span style={{ color: "var(--saffron)" }}>✈ Departure</span>}</Td>
                  <Td>
                    <button 
                      onClick={() => setDeleteTarget({ id: b.id, title: b.title })} 
                      className="btn btn-outline btn-sm" style={{ borderColor: "#ffcdd2", color: "#c62828" }}
                    >
                      Delete
                    </button>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Itinerary"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isProcessing={isDeleting}
      />

      {showModal && (
        <Modal title="Add Itinerary Block" onClose={() => setShowModal(false)}>
          
          {errorMsg && (
            <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span>⚠</span><span>{errorMsg}</span>
            </div>
          )}

          <FormRow label="Itinerary Title"><input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Dal Lake Sightseeing" /></FormRow>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div className="form-group"><label className="form-label">Day Number</label><select className="form-select" value={formData.day_number} onChange={e => setFormData({...formData, day_number: e.target.value})}>{[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>Day {d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Departs From</label><select className="form-select" value={formData.departs_from} onChange={e => setFormData({...formData, departs_from: e.target.value})}><option value="arrival">Arrival</option><option value="srinagar">Srinagar</option><option value="pahalgam">Pahalgam</option><option value="gulmarg">Gulmarg</option></select></div>
            <div className="form-group"><label className="form-label">Overnight At</label><select className="form-select" value={formData.overnight_slug} onChange={e => setFormData({...formData, overnight_slug: e.target.value})}><option value="srinagar">Srinagar</option><option value="pahalgam">Pahalgam</option><option value="gulmarg">Gulmarg</option><option value="departure">Departure</option></select></div>
          </div>
          <FormRow label="Description"><textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} placeholder="Full day description shown to agents..." /></FormRow>
          <FormRow label="Highlights (comma separated)"><input className="form-input" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} placeholder="Dal Lake, Shikara Ride" /></FormRow>
          
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-md)" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Itinerary"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Hotels Section ─────────────────────────────────────────────────────────

function HotelsSection() {
  const [showModal, setShowModal] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({ name: "", destination_id: "", base_cp_rate: 0 });

  const fetchData = async () => {
    try {
      const [hotelsData, destData] = await Promise.all([ api.hotels.list(), api.destinations.list() ]);
      const safeDestData = Array.isArray(destData) ? destData : (destData?.data || []);
      setHotels(Array.isArray(hotelsData) ? hotelsData : (hotelsData?.data || []));
      setDestinations(safeDestData);
      
      if (safeDestData.length > 0 && !formData.destination_id) {
        setFormData(prev => ({ ...prev, destination_id: safeDestData[0].id }));
      }
    } catch (err) { console.error("Failed to load hotels data:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setErrorMsg("");
    if (!formData.name || !formData.destination_id) return setErrorMsg("Hotel Name and Destination are required.");
    
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        destination_id: formData.destination_id,
        category: "Standard",
        stars: 3,
        room_types: [
          {
            name: "Standard Room",
            max_occupancy: 3,
            extra_bed_rate: 1500,
            meal_plan_rates: [
              { meal_plan: "CP", rate_per_night: parseInt(formData.base_cp_rate) || 0 }
            ]
          }
        ]
      };
      await api.hotels.create(payload);
      setShowModal(false);
      setFormData({ name: "", destination_id: destinations[0]?.id || "", base_cp_rate: 0 });
      fetchData();
    } catch (err) { 
      setErrorMsg(err.message || "An unexpected error occurred."); 
    } finally { 
      setLoading(false); 
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { 
      await api.hotels.delete(deleteTarget.id); 
      setDeleteTarget(null);
      fetchData(); 
    } catch (err) { 
      setDeleteTarget(null);
      console.error("Error deleting hotel: " + err.message); 
    } finally {
      setIsDeleting(false);
    }
  };

  const getDestName = (id) => {
    const dest = destinations.find(d => d.id === id);
    return dest ? dest.name : "Unknown";
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Hotel Management" subtitle="Manage hotel inventory and base rates" onAdd={() => { setShowModal(true); setErrorMsg(""); }} addLabel="Add Hotel" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>Hotel Name</Th><Th>Destination</Th><Th>Base Rate (CP)</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {(hotels || []).map((h) => (
              <TableRow key={h.id}>
                <Td style={{ fontWeight: 600 }}>{h.name}</Td>
                <Td>{getDestName(h.destination_id)}</Td>
                {/* CRITICAL FIX: Changed h.roomTypes to h.room_types */}
                <Td>₹{h.room_types?.[0]?.meal_plan_rates?.[0]?.rate_per_night?.toLocaleString() || "N/A"}</Td>
                <Td>
                  <button onClick={() => setDeleteTarget({ id: h.id, title: h.name })} className="btn btn-outline btn-sm" style={{ borderColor: "#ffcdd2", color: "#c62828" }}>Delete</button>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmActionModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Hotel"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isProcessing={isDeleting}
      />

      {showModal && (
        <Modal title="Add Hotel" onClose={() => setShowModal(false)}>
          {errorMsg && (
            <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span>⚠</span><span>{errorMsg}</span>
            </div>
          )}
          <FormRow label="Hotel Name"><input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., The Lalit Grand Palace" /></FormRow>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div className="form-group"><label className="form-label">Destination</label><select className="form-select" value={formData.destination_id} onChange={e => setFormData({...formData, destination_id: e.target.value})}>{destinations.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}</select></div>
            <FormRow label="Base Rate (CP Plan - ₹)"><input className="form-input" type="number" value={formData.base_cp_rate} onChange={e => setFormData({...formData, base_cp_rate: e.target.value})} placeholder="e.g., 4500" /></FormRow>
          </div>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-lg)" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Hotel"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Vehicles Section ───────────────────────────────────────────────────────

function VehiclesSection() {
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({ vehicle_type: "", models: "", capacity_pax: 4, luggage_capacity: "2 Bags", per_day_rate: 0, per_km_rate: 0 });

  const fetchVehicles = async () => {
    try {
      const data = await api.vehicles.list(false);
      setVehicles(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error("Failed to load vehicles:", err); }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleSave = async () => {
    setErrorMsg("");
    if (!formData.vehicle_type) return setErrorMsg("Vehicle Type is required.");
    
    setLoading(true);
    try {
      const payload = {
        vehicle_type: formData.vehicle_type,
        models: formData.models,
        capacity_pax: parseInt(formData.capacity_pax) || 4,
        luggage_capacity: formData.luggage_capacity.toString(),
        per_day_rate: parseFloat(formData.per_day_rate) || 0,
        per_km_rate: parseFloat(formData.per_km_rate) || 0,
        airport_transfer_rate: 0, 
        is_active: true
      };
      await api.vehicles.create(payload);
      setShowModal(false);
      setFormData({ vehicle_type: "", models: "", capacity_pax: 4, luggage_capacity: "2 Bags", per_day_rate: 0, per_km_rate: 0 });
      fetchVehicles();
    } catch (err) { 
      setErrorMsg(err.message || "An unexpected error occurred."); 
    } finally { 
      setLoading(false); 
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { 
      await api.vehicles.delete(deleteTarget.id); 
      setDeleteTarget(null);
      fetchVehicles(); 
    } catch (err) { 
      setDeleteTarget(null);
      console.error("Error deleting vehicle: " + err.message); 
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Vehicle Management" subtitle="Manage fleet and rates" onAdd={() => { setShowModal(true); setErrorMsg(""); }} addLabel="Add Vehicle" />
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Vehicle</Th><Th>Models</Th><Th>Capacity</Th><Th>Per Day Rate</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {(vehicles || []).map((v) => (
                <TableRow key={v.id}>
                  <Td><span style={{ fontWeight: 700 }}>{v.vehicle_type}</span></Td>
                  <Td style={{ color: "var(--ink-muted)" }}>{v.models}</Td>
                  <Td>{v.capacity_pax} Pax</Td>
                  <Td style={{ fontWeight: 600 }}>₹{v.per_day_rate?.toLocaleString()}</Td>
                  <Td>
                    <button onClick={() => setDeleteTarget({ id: v.id, title: v.vehicle_type })} className="btn btn-outline btn-sm" style={{ borderColor: "#ffcdd2", color: "#c62828" }}>Delete</button>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isProcessing={isDeleting}
      />

      {showModal && (
        <Modal title="Add Vehicle" onClose={() => setShowModal(false)}>
          {errorMsg && (
            <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span>⚠</span><span>{errorMsg}</span>
            </div>
          )}
          <FormRow label="Vehicle Type"><input className="form-input" value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})} placeholder="e.g., Innova Crysta" /></FormRow>
          <FormRow label="Models / Variants"><input className="form-input" value={formData.models} onChange={e => setFormData({...formData, models: e.target.value})} placeholder="e.g., Toyota Innova Crysta 7-seater" /></FormRow>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <FormRow label="Pax Capacity"><input className="form-input" type="number" value={formData.capacity_pax} onChange={e => setFormData({...formData, capacity_pax: e.target.value})} /></FormRow>
            <FormRow label="Luggage Info"><input className="form-input" value={formData.luggage_capacity} onChange={e => setFormData({...formData, luggage_capacity: e.target.value})} /></FormRow>
          </div>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <FormRow label="Per Day Rate (₹)"><input className="form-input" type="number" value={formData.per_day_rate} onChange={e => setFormData({...formData, per_day_rate: e.target.value})} /></FormRow>
            <FormRow label="Per Km Rate (₹)"><input className="form-input" type="number" value={formData.per_km_rate} onChange={e => setFormData({...formData, per_km_rate: e.target.value})} /></FormRow>
          </div>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Vehicle"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Agents Section ─────────────────────────────────────────────────────────

function AgentsSection() {
  const [agents, setAgents] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [actionTarget, setActionTarget] = useState(null); // Used for suspend action
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAgents = async () => {
    try {
      const data = await api.agents.list();
      setAgents(Array.isArray(data) ? data : (data?.items || data?.data || []));
    } catch (err) { console.error("Failed to fetch agents:", err); }
  };

  
  useEffect(() => {
    fetchAgents();
  }, []);

  const handleApprove = async (id) => {
    setErrorMsg("");
    try { 
      await api.agents.approve(id); 
      fetchAgents(); 
    } catch (err) { 
      setErrorMsg("Error approving agent: " + err.message); 
    }
  };

  const executeSuspend = async () => {
    if (!actionTarget) return;
    setIsProcessing(true);
    setErrorMsg("");
    try { 
      await api.agents.suspend(actionTarget.id); 
      setActionTarget(null);
      fetchAgents(); 
    } catch (err) { 
      setActionTarget(null);
      setErrorMsg("Error suspending agent: " + err.message); 
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Agent Management" subtitle="Manage sub-agents and approvals" />
      
      {errorMsg && (
        <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>⚠</span><span>{errorMsg}</span>
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Agency</Th><Th>City</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {(agents || []).map((a) => (
                <TableRow key={a.id}>
                  <Td><span style={{ fontWeight: 600 }}>{a.agency_name || "Agent"}</span></Td>
                  <Td>{a.city || "N/A"}</Td>
                  <Td><span className={`badge ${a.is_approved ? "badge-success" : "badge-saffron"}`}>{a.is_approved ? "Active" : "Pending"}</span></Td>
                  <Td>
                    {!a.is_approved ? (
                      <button onClick={() => handleApprove(a.id)} className="btn btn-outline btn-sm" style={{ borderColor: "#4caf50", color: "#4caf50" }}>Approve</button>
                    ) : (
                      <button onClick={() => setActionTarget({ id: a.id, title: a.agency_name })} className="btn btn-outline btn-sm" style={{ borderColor: "#ffcdd2", color: "#c62828" }}>Suspend</button>
                    )}
                  </Td>
                </TableRow>
              ))}
              {agents.length === 0 && <tr><Td colSpan="4" style={{textAlign:"center", padding:"var(--space-xl)"}}>No agents found.</Td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={executeSuspend}
        title="Suspend Agent"
        message={`Are you sure you want to suspend "${actionTarget?.title}"? Their account access will be revoked.`}
        confirmText="Yes, Suspend"
        isProcessing={isProcessing}
      />
    </div>
  );
}

// ─── Activities Section ─────────────────────────────────────────────────────

function ActivitiesSection() {
  const [showModal, setShowModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({ name: "", category: "Sightseeing", base_price: 0, duration_label: "1 Hour" });

  const fetchActivities = async () => {
    try {
      const data = await api.activities.list();
      setActivities(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error("Failed to fetch activities:", err); }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleSave = async () => {
    setErrorMsg("");
    if (!formData.name || !formData.duration_label) return setErrorMsg("Please fill all required fields.");
    
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        base_price: parseFloat(formData.base_price) || 0,
        duration_label: formData.duration_label,
        is_active: true
      };
      await api.activities.create(payload);
      setShowModal(false);
      setFormData({ name: "", category: "Sightseeing", base_price: 0, duration_label: "1 Hour" });
      fetchActivities(); 
    } catch (err) { 
      setErrorMsg(err.message || "An unexpected error occurred."); 
    } finally { 
      setLoading(false); 
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { 
      await api.activities.delete(deleteTarget.id); 
      setDeleteTarget(null);
      fetchActivities(); 
    } catch (err) { 
      setDeleteTarget(null);
      console.error("Error deleting activity: " + err.message); 
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Activities Management" onAdd={() => { setShowModal(true); setErrorMsg(""); }} addLabel="Add Activity" />
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><Th>Name</Th><Th>Category</Th><Th>Base Price</Th><Th>Duration</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {activities.map((a) => (
              <TableRow key={a.id}>
                <Td style={{ fontWeight: 600 }}>{a.name}</Td>
                <Td>{a.category}</Td>
                <Td>₹{a.base_price?.toLocaleString()}</Td>
                <Td>{a.duration_label}</Td>
                <Td><button onClick={() => setDeleteTarget({ id: a.id, title: a.name })} className="btn btn-outline btn-sm" style={{ borderColor: "#ffcdd2", color: "#c62828" }}>Delete</button></Td>
              </TableRow>
            ))}
            {activities.length === 0 && <tr><Td colSpan="5" style={{textAlign:"center", padding:"var(--space-xl)"}}>No activities found.</Td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmActionModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Activity"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isProcessing={isDeleting}
      />

      {showModal && (
        <Modal title="Add Activity" onClose={() => setShowModal(false)}>
          {errorMsg && (
            <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span>⚠</span><span>{errorMsg}</span>
            </div>
          )}
          <FormRow label="Activity Name"><input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Shikara Ride" /></FormRow>
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
            <FormRow label="Duration Label"><input className="form-input" value={formData.duration_label} onChange={e => setFormData({...formData, duration_label: e.target.value})} placeholder="e.g., 1 Hour" /></FormRow>
          </div>
          <FormRow label="Base Price (₹)"><input className="form-input" type="number" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} placeholder="e.g., 800" /></FormRow>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", marginTop: "var(--space-lg)" }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Activity"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Quotations Section ─────────────────────────────────────────────────────

// ─── Quotations Section ─────────────────────────────────────────────────────

// 1. Add { navigate } to the props here
// ─── Quotations Section ─────────────────────────────────────────────────────

function QuotationsSection({ navigate }) {
  const [quotations, setQuotations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuotations = async () => {
    try {
      const data = await api.quotations.list();
      setQuotations(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { 
      setErrorMsg("Failed to load quotations."); 
    } 
  };

  useEffect(() => { fetchQuotations(); }, []);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.quotations.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchQuotations();
    } catch (err) {
      setDeleteTarget(null);
      setErrorMsg("Error deleting quotation. Check backend logs.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="All Quotations" subtitle="View quotations created by all agents" />
      
      {errorMsg && (
        <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>⚠</span><span>{errorMsg}</span>
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>Quote ID</Th><Th>Client</Th><Th>Amount</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {(quotations || []).map((q) => (
                <TableRow key={q.id} onClick={() => navigate("quotation", q)}>
                  <Td style={{ fontFamily: "monospace", color: "var(--pine)", fontWeight: 700 }}>{q.id.split('-')[0]}</Td>
                  <Td>{q.client_name}</Td>
                  <Td style={{ fontWeight: 700, color: "var(--pine)" }}>₹{q.total_cost?.toLocaleString()}</Td>
                  <Td>
                    <span className="badge" style={{ background: q.status === "CONFIRMED" ? "#e8f5e9" : "#f5f5f5", color: q.status === "CONFIRMED" ? "#2e7d32" : "#8a8a8a", fontWeight: 700, padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem" }}>
                      {q.status}
                    </span>
                  </Td>
                  <Td>
                     <button 
                       onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: q.id, title: q.client_name }); }} 
                       className="btn btn-outline btn-sm" 
                       style={{ borderColor: "#ffcdd2", color: "#c62828" }}
                     >
                       Delete
                     </button>
                  </Td>
                </TableRow>
              ))}
              {quotations.length === 0 && <tr><Td colSpan="5" style={{textAlign:"center", padding:"var(--space-xl)"}}>No quotations found.</Td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Quotation"
        message={`Are you sure you want to delete the quotation for "${deleteTarget?.title}"?`}
        isProcessing={isDeleting}
      />
    </div>
  );
}
// ─── Pricing Section ────────────────────────────────────────────────────────

function PricingSection() {
  const [seasonalRates, setSeasonalRates] = useState([]);
  const [editingSeason, setEditingSeason] = useState(null);
  const [newMultiplier, setNewMultiplier] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchPricing = async () => {
    try {
      const data = await api.pricing.listSeasonal();
      setSeasonalRates(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { 
      setErrorMsg("Failed to load pricing data."); 
    }
  };

  useEffect(() => { fetchPricing(); }, []);

  const handleUpdateSeason = async (seasonId) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.pricing.patchSeason(seasonId, { multiplier: parseFloat(newMultiplier) });
      setEditingSeason(null);
      fetchPricing(); 
      setSuccessMsg("Seasonal rate updated successfully.");
    } catch (err) { 
      setErrorMsg("Failed to update season: " + err.message); 
    }
  };

  const handleMockUpdate = () => {
    setErrorMsg("");
    setSuccessMsg("Markup rules updated successfully.");
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Pricing Rules & Seasonal Rates" subtitle="Set seasonal pricing and surcharges" />
      
      {errorMsg && (
        <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>⚠</span><span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#2e7d32", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>✓</span><span>{successMsg}</span>
        </div>
      )}

      <div className="card" style={{ padding: "var(--space-xl)", maxWidth: "800px" }}>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Seasonal Rate Multipliers</h4>
        {seasonalRates.length > 0 ? seasonalRates.map(s => (
          <div key={s.season} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md) 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{s.label || s.season}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
              {editingSeason === s.season ? (
                <>
                  <input type="number" step="0.01" className="form-input" style={{ width: "80px", padding: "4px" }} value={newMultiplier} onChange={e => setNewMultiplier(e.target.value)} />
                  <button className="btn btn-primary btn-sm" onClick={() => handleUpdateSeason(s.season)}>Save</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditingSeason(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--pine)", fontWeight: 500 }}>{Number(s.multiplier).toFixed(2)}×</span>
                  <button className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }} onClick={() => { setEditingSeason(s.season); setNewMultiplier(s.multiplier); }}>Edit</button>
                </>
              )}
            </div>
          </div>
        )) : (
          <div style={{ color: "var(--ink-muted)", fontSize: "0.875rem" }}>No seasonal rules found in database.</div>
        )}

        <div style={{ marginTop: "var(--space-xl)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-xl)" }}>
           <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Default Markup Rules</h4>
           <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
             <input className="form-input" defaultValue="15" type="number" style={{ width: 80 }} />
             <span style={{ color: "var(--ink-muted)" }}>%</span>
             <button className="btn btn-primary btn-sm" onClick={handleMockUpdate}>Update</button>
           </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Section ───────────────────────────────────────────────────────

function SettingsSection() {
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = () => {
    setSuccessMsg("Settings saved successfully.");
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <SectionHeader title="Platform Settings" subtitle="Configure portal-wide settings and preferences" />
      
      {successMsg && (
        <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#2e7d32", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>✓</span><span>{successMsg}</span>
        </div>
      )}

      <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
        {[
          { title: "General Settings", items: ["Portal Name", "Default Currency", "Contact Email"] },
          { title: "Booking Settings", items: ["Min Advance Booking Days", "Payment Terms"] },
        ].map(section => (
          <div key={section.title} className="card" style={{ padding: "var(--space-xl)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>{section.title}</h4>
            {section.items.map(item => (
              <div key={item} className="form-group" style={{ marginBottom: "var(--space-md)" }}>
                <label className="form-label">{item}</label>
                <input className="form-input" placeholder={`Enter ${item}`} />
              </div>
            ))}
            <button className="btn btn-primary btn-sm" style={{ marginTop: "var(--space-md)" }} onClick={handleSave}>Save Changes</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard Component ─────────────────────────────────────────

export default function AdminDashboard({ navigate, onLogout, userRole }) {
  const [activeSection, setActiveSection] = useState("destinations");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (userRole === "agent") {
      navigate("agent-dashboard");
    }
  }, [userRole, navigate]);

const renderSection = () => {
    switch (activeSection) {
      case "destinations": return <DestinationsSection />;
      case "itineraries":  return <ItinerariesSection />;
      case "hotels":       return <HotelsSection />;
      case "vehicles":     return <VehiclesSection />;
      case "agents":       return <AgentsSection />;
      case "quotations":   return <QuotationsSection navigate={navigate} />;
      case "pricing":      return <PricingSection />; 
      case "activities":   return <ActivitiesSection />;
      case "settings":     return <SettingsSection />; 
      default:             return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)", display: "flex", flexDirection: "column" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="admin" />

      <div style={{ display: "flex", flex: 1, paddingTop: "64px" }}>
        
        {mobileMenuOpen && (
          <div 
            className="mobile-block" 
            onClick={() => setMobileMenuOpen(false)} 
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} 
          />
        )}

        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
          width: 240, flexShrink: 0,
          background: "var(--pine)",
          position: "fixed", top: 64, left: 0, bottom: 0,
          overflowY: "auto", zIndex: 200,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "var(--space-xl) var(--space-lg)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Admin Panel</div>
            <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Super Administrator</div>
          </div>

          <nav style={{ padding: "var(--space-md) var(--space-sm)", flex: 1 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false); 
                }} style={{
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
                onMouseEnter={e => { if (activeSection !== item.id) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "white"; } }}
                onMouseLeave={e => { if (activeSection !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

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

        <main className="admin-main" style={{ marginLeft: 240, flex: 1, padding: "var(--space-xl)", minWidth: 0 }}>
          <div className="mobile-flex" style={{ marginBottom: "var(--space-lg)", alignItems: "center", gap: "var(--space-md)", background: "white", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <button onClick={() => setMobileMenuOpen(true)} className="btn btn-outline btn-sm" style={{ padding: "4px 10px" }}>☰ Menu</button>
            <div style={{ fontWeight: 600, color: "var(--pine)" }}>{NAV_ITEMS.find(i => i.id === activeSection)?.label}</div>
          </div>

          <div style={{ animation: "fadeInUp 0.4s ease" }} key={activeSection}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}