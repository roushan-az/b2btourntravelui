import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

const STEPS = ["Itinerary", "Hotels", "Vehicles", "Summary"];
const mealPlans = [
  { code: "EP", icon: "🛏️" }, { code: "CP", icon: "☕" },
  { code: "MAP", icon: "🍽️" }, { code: "AP", icon: "🍱" }
];

// Helper to extract rates safely
const getRate = (hotel, planCode) => {
  if (!hotel?.room_types?.length) return 0;
  const rates = hotel.room_types[0].meal_plan_rates || [];
  const target = rates.find(r => r.meal_plan.toLowerCase() === planCode.toLowerCase());
  return target ? target.rate_per_night : 0;
};

// --- Child Components ---
function StepIndicator({ currentStep }) {
  return (
    <div className="table-scroll" style={{ paddingBottom: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, minWidth: "400px" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: i < currentStep ? "var(--pine)" : i === currentStep ? "var(--saffron)" : "var(--border)",
                color: i <= currentStep ? "white" : "var(--ink-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: i < currentStep ? "1rem" : "0.85rem",
                fontWeight: 700, transition: "all var(--transition)",
                boxShadow: i === currentStep ? "0 0 0 4px rgba(212,130,42,0.2)" : "none",
              }}>
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: i === currentStep ? 700 : 400, color: i === currentStep ? "var(--saffron)" : i < currentStep ? "var(--pine)" : "var(--ink-muted)", textTransform: "uppercase" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 80, height: 2, background: i < currentStep ? "var(--pine)" : "var(--border)", margin: "0 8px", marginBottom: "22px" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ItineraryCard({ block, isSelected, onSelect }) {
  return (
    <div onClick={() => onSelect(block)} style={{
      background: isSelected ? "var(--pine)" : "white",
      border: isSelected ? "2px solid var(--pine)" : "1.5px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "var(--space-lg)",
      cursor: "pointer", transition: "all 0.2s ease",
      transform: isSelected ? "scale(1.02)" : "scale(1)",
      boxShadow: isSelected ? "var(--shadow-lg)" : "var(--shadow-sm)",
      position: "relative"
    }}>
      {isSelected && <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, background: "var(--saffron)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700 }}>✓</div>}
      <h4 style={{ fontSize: "1.1rem", color: isSelected ? "white" : "var(--ink)", marginBottom: "6px" }}>{block.title}</h4>
      <p style={{ fontSize: "0.85rem", color: isSelected ? "rgba(255,255,255,0.8)" : "var(--ink-muted)", lineHeight: 1.5 }}>{block.description}</p>
      {block.overnight_slug && (
        <div style={{ marginTop: "10px", fontSize: "0.75rem", color: isSelected ? "var(--saffron-light)" : "var(--pine)", fontWeight: 600 }}>
          🌙 Overnight: {block.overnight_slug}
        </div>
      )}
    </div>
  );
}

function HotelCard({ hotel, isSelected, onSelect, mealPlan, onMealChange }) {
  const imageUrl = hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";
  
  return (
    <div style={{
      border: isSelected ? "2px solid var(--pine)" : "1.5px solid var(--border)",
      borderRadius: "var(--radius-lg)", overflow: "hidden", background: "white",
      cursor: "pointer", boxShadow: isSelected ? "var(--shadow-lg)" : "var(--shadow-sm)",
      transition: "all 0.2s ease", transform: isSelected ? "scale(1.02)" : "scale(1)"
    }}>
      <div style={{ height: 140, position: "relative" }} onClick={() => onSelect(hotel)}>
        <img src={imageUrl} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {isSelected && <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, background: "var(--pine)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>✓</div>}
        <div style={{ position: "absolute", bottom: 8, left: 10 }}>
          <div style={{ background: "var(--saffron)", color: "white", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "12px", fontWeight: 600 }}>{hotel.category}</div>
        </div>
      </div>
      
      <div style={{ padding: "16px" }} onClick={() => onSelect(hotel)}>
        <h4 style={{ fontSize: "1rem", marginBottom: "4px" }}>{hotel.name}</h4>
        <div style={{ fontSize: "0.8rem", color: "var(--saffron)" }}>{"★".repeat(hotel.stars || 3)}</div>
      </div>

      {isSelected && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--snow-warm)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--ink-muted)", marginBottom: "8px" }}>Select Meal Plan</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
            {mealPlans.map(mp => (
              <button key={mp.code} onClick={(e) => { e.stopPropagation(); onMealChange(mp.code); }} style={{
                padding: "6px", borderRadius: "6px",
                border: mealPlan === mp.code ? "1.5px solid var(--pine)" : "1px solid var(--border)",
                background: mealPlan === mp.code ? "var(--pine)" : "white",
                color: mealPlan === mp.code ? "white" : "var(--ink-muted)",
                cursor: "pointer", fontSize: "0.75rem", fontWeight: 600
              }}>
                {mp.code}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--pine)", fontWeight: 700, textAlign: "right" }}>
            ₹{getRate(hotel, mealPlan).toLocaleString("en-IN")} / night
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Builder Component ---
export default function PackageBuilder({ navigate, onLogout, location }) {
  const pkg = location?.state || { nights: 4, days: 5, label: "Custom Package", description: "" };
  const [step, setStep] = useState(0);

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [dbData, setDbData] = useState({
    itineraries: [], hotels: [], vehicles: [], destinations: []
  });

  const [selections, setSelections] = useState({
    itinerary: {}, hotels: {}, vehicles: null, clientName: "", pax: 2, travelDate: ""
  });

  useEffect(() => {
    Promise.all([
      api.itineraries.list(),
      api.hotels.list(),
      api.vehicles.list(true),
      api.destinations.list()
    ]).then(([iters, htls, vehs, dests]) => {
       setDbData({
          itineraries: Array.isArray(iters) ? iters : (iters?.items || iters?.data || []),
          hotels: Array.isArray(htls) ? htls : (htls?.items || htls?.data || []),
          vehicles: Array.isArray(vehs) ? vehs : (vehs?.items || vehs?.data || []),
          destinations: Array.isArray(dests) ? dests : (dests?.items || dests?.data || []),
       });
    }).catch(err => console.error("Error loading package data:", err));
  }, []);

  const days = Array.from({ length: pkg.days }, (_, i) => i + 1);

  // FIX: Unlocked routing. Agents can now select ANY itinerary for ANY day.
  const getBlocksForDay = (dayNum) => {
    return dbData.itineraries;
  };

  const selectItinerary = (dayNum, block) => {
    const newSel = { ...selections.itinerary };
    newSel[dayNum] = block;
    setSelections(s => ({ ...s, itinerary: newSel }));
  };

  const toggleHotel = (hotel) => {
    setSelections(s => {
      const newHotels = { ...s.hotels };
      if (newHotels[hotel.id]) {
        delete newHotels[hotel.id]; // Deselect if already selected
      } else {
        // Enforce 1 hotel per destination rule
        Object.keys(newHotels).forEach(id => {
          if (newHotels[id].hotel.destination_id === hotel.destination_id) {
            delete newHotels[id];
          }
        });
        newHotels[hotel.id] = { hotel, mealPlan: "CP" };
      }
      return { ...s, hotels: newHotels };
    });
  };

  const selectedHotels = Object.values(selections.hotels);

  const totalCost = (() => {
    let total = 0;
    selectedHotels.forEach(({ hotel, mealPlan }) => {
      total += getRate(hotel, mealPlan) * pkg.nights;
    });
    if (selections.vehicles) total += selections.vehicles.per_day_rate * pkg.days;
    return total;
  })();

const handleGenerateQuote = async () => {
    setSubmitError("");

    // Mandatory Field Checks
    if (!selections.clientName || !selections.clientName.trim()) {
      setSubmitError("Please enter the Client Name before generating the quotation.");
      return;
    }
    if (!selections.travelDate) {
      setSubmitError("Please select a valid Travel Date before generating the quotation.");
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteItems = selectedHotels.map(({ hotel, mealPlan }) => ({
         description: `Hotel: ${hotel.name} (${hotel.category})`,
         detail: `Meal Plan: ${mealPlan}`,
         quantity: pkg.nights,
         unit_price: getRate(hotel, mealPlan),
         total_price: getRate(hotel, mealPlan) * pkg.nights
      }));

      if (selections.vehicles) {
         quoteItems.push({
            description: `Vehicle: ${selections.vehicles.vehicle_type}`,
            detail: selections.vehicles.models,
            quantity: pkg.days,
            unit_price: selections.vehicles.per_day_rate,
            total_price: selections.vehicles.per_day_rate * pkg.days
         });
      }

      // Payload now explicitly sends travel_date to FastAPI
      const payload = {
        client_name: selections.clientName,
        client_email: "client@example.com",
        client_phone: "0000000000",
        package_label: pkg.label || "Custom Package",
        nights: pkg.nights,
        days: pkg.days,
        travel_date: selections.travelDate,
        total_cost: Math.round(totalCost * 1.05), 
        items: quoteItems,
        activities: []
      };
      
      const newQuote = await api.quotations.create(payload, false);
      navigate("quotation", { state: { packageData: pkg, selections, totalCost, quoteRef: newQuote }});
      
    } catch (err) {
      console.error("❌ Failed to generate quote:", err);
      const errorDetail = err.body?.detail 
        ? (typeof err.body.detail === 'string' ? err.body.detail : JSON.stringify(err.body.detail)) 
        : err.message || "Internal Server Error";
        
      setSubmitError(`Failed to save: ${errorDetail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="agent" />
      <div style={{ paddingTop: "64px" }}>
        
        {/* Sticky Header */}
        <div style={{ background: "white", borderBottom: "1px solid var(--border)", position: "sticky", top: 64, zIndex: 100, padding: "var(--space-lg) 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <StepIndicator currentStep={step} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase" }}>Running Total</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--pine)", fontWeight: 700 }}>₹{totalCost.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "var(--space-xl)" }}>

          {/* STEP 0: Itineraries */}
          {step === 0 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "24px" }}>Select Daily Itinerary</h3>
              {days.map((dayNum) => {
                const blocks = getBlocksForDay(dayNum);
                const isLocked = dayNum > 1 && !selections.itinerary[dayNum - 1];
                
                return (
                  <div key={dayNum} style={{ marginBottom: "32px", opacity: isLocked ? 0.5 : 1 }}>
                    <h4 style={{ marginBottom: "12px", color: "var(--pine)" }}>Day {dayNum}</h4>
                    {isLocked ? (
                      <p style={{ fontSize: "0.85rem" }}>Select the previous day to unlock route options.</p>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                        {blocks.map(block => (
                          <ItineraryCard 
                            key={block.id} block={block} 
                            isSelected={selections.itinerary[dayNum]?.id === block.id} 
                            onSelect={(b) => selectItinerary(dayNum, b)} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "32px" }}>
                <button className="btn btn-outline" onClick={() => navigate("agent-dashboard")}>Cancel</button>
                {/* FIX: Unlocked the continue button so it activates as soon as Day 1 is selected */}
                <button className="btn btn-primary" disabled={!selections.itinerary[1]} onClick={() => setStep(1)}>Continue to Hotels →</button>
              </div>
            </div>
          )}

          {/* STEP 1: Hotels */}
          {step === 1 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "24px" }}>Select Accommodations</h3>
              {dbData.destinations.map(dest => {
                const destHotels = dbData.hotels.filter(h => h.destination_id === dest.id);
                // Only show destinations if they have hotels
                if (destHotels.length === 0) return null;

                return (
                  <div key={dest.id} style={{ marginBottom: "32px" }}>
                    <h4 style={{ fontSize: "1.2rem", marginBottom: "16px", textTransform: "capitalize" }}>{dest.name} Hotels</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                      {destHotels.map(hotel => (
                        <HotelCard 
                          key={hotel.id} hotel={hotel} 
                          isSelected={!!selections.hotels[hotel.id]} 
                          onSelect={toggleHotel}
                          mealPlan={selections.hotels[hotel.id]?.mealPlan || "CP"}
                          onMealChange={(mp) => {
                            setSelections(s => ({ ...s, hotels: { ...s.hotels, [hotel.id]: { ...s.hotels[hotel.id], mealPlan: mp } } }));
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "32px" }}>
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Vehicles →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicles */}
          {step === 2 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "24px" }}>Select Transportation</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {dbData.vehicles.map(v => (
                  <div key={v.id} onClick={() => setSelections(s => ({ ...s, vehicles: s.vehicles?.id === v.id ? null : v }))} style={{ 
                    background: "white", padding: "20px", borderRadius: "12px", cursor: "pointer",
                    border: selections.vehicles?.id === v.id ? "2px solid var(--pine)" : "1px solid var(--border)",
                    boxShadow: selections.vehicles?.id === v.id ? "var(--shadow-lg)" : "var(--shadow-sm)",
                    transition: "all 0.2s ease", transform: selections.vehicles?.id === v.id ? "scale(1.02)" : "scale(1)"
                  }}>
                    <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{v.vehicle_type}</h4>
                    <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", marginBottom: "12px" }}>{v.models}</p>
                    <div style={{ fontSize: "0.8rem", background: "var(--snow-warm)", display: "inline-block", padding: "4px 10px", borderRadius: "12px", marginBottom: "16px" }}>
                      👥 {v.capacity_pax} Pax
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--pine)" }}>₹{v.per_day_rate.toLocaleString("en-IN")} <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--ink-muted)" }}>/ day</span></div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "32px" }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" disabled={!selections.vehicles} onClick={() => setStep(3)}>Review Package →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Summary & Lead Capture */}
          {step === 3 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
                
                {/* Left Side: Summary Cards */}
                <div>
                  <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "1.2rem", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>Selected Hotels</h4>
                    {selectedHotels.map(({ hotel, mealPlan }) => (
                      <div key={hotel.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                          <strong>{hotel.name}</strong> <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>({mealPlan})</span>
                        </div>
                        <div style={{ fontWeight: 600 }}>₹{(getRate(hotel, mealPlan) * pkg.nights).toLocaleString("en-IN")}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card" style={{ padding: "24px" }}>
                    <h4 style={{ fontSize: "1.2rem", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>Selected Vehicle</h4>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <strong>{selections.vehicles.vehicle_type}</strong> <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>({pkg.days} Days)</span>
                      </div>
                      <div style={{ fontWeight: 600 }}>₹{(selections.vehicles.per_day_rate * pkg.days).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Lead Capture & Pricing */}
                <div className="card" style={{ padding: "24px", background: "var(--snow-warm)" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Quotation Details</h4>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                    <input className="form-input" placeholder="Client Name" value={selections.clientName} onChange={e => setSelections({...selections, clientName: e.target.value})} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <input className="form-input" type="number" placeholder="Pax" value={selections.pax} onChange={e => setSelections({...selections, pax: e.target.value})} />
                      <input className="form-input" type="date" value={selections.travelDate} onChange={e => setSelections({...selections, travelDate: e.target.value})} />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
                    <span>Subtotal</span>
                    <span>₹{totalCost.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "0.9rem" }}>
                    <span>GST (5%)</span>
                    <span>₹{Math.round(totalCost * 0.05).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--pine)", paddingTop: "16px", marginBottom: "24px" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total Package Cost</span>
                    <span style={{ fontSize: "1.4rem", color: "var(--pine)", fontWeight: 700 }}>₹{Math.round(totalCost * 1.05).toLocaleString("en-IN")}</span>
                  </div>

                  {/* NEW: Inline Error Banner */}
                  {submitError && (
                    <div style={{ 
                      background: "#fff3f3", border: "1px solid #ffcdd2", 
                      borderRadius: "var(--radius-md)", padding: "12px", 
                      color: "#c62828", fontSize: "0.85rem", 
                      marginBottom: "16px", lineHeight: 1.4 
                    }}>
                      <strong>Error:</strong> {submitError}
                    </div>
                  )}

                  <button 
                    className="btn btn-primary w-full" 
                    style={{ padding: "12px", fontSize: "1rem", justifyContent: "center" }} 
                    onClick={handleGenerateQuote}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Generating..." : "Generate Final Quotation"}
                  </button>
                  <button className="btn btn-outline w-full" style={{ padding: "12px", marginTop: "12px", justifyContent: "center" }} onClick={() => setStep(2)}>
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}