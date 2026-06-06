import { useState } from "react";
import Navbar from "../components/Navbar";
import { itineraryBlocks, hotels, vehicles, mealPlans } from "../data/mockData";

const STEPS = ["Itinerary", "Hotels", "Vehicles", "Summary"];

function StepIndicator({ currentStep }) {
  return (
    <div className="table-scroll" style={{ paddingBottom: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, minWidth: "400px" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            }}>
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
              <span style={{ fontSize: "0.72rem", fontWeight: i === currentStep ? 700 : 400, color: i === currentStep ? "var(--saffron)" : i < currentStep ? "var(--pine)" : "var(--ink-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 80, height: 2, background: i < currentStep ? "var(--pine)" : "var(--border)", margin: "0 8px", marginBottom: "22px", transition: "all var(--transition)" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ItineraryCard({ block, isSelected, onSelect, dragging }) {
  return (
    <div
      onClick={() => onSelect(block)}
      style={{
        background: isSelected ? "var(--pine)" : "white",
        border: isSelected ? "2px solid var(--pine)" : "1.5px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "var(--space-lg)",
        cursor: "pointer", transition: "all var(--transition)",
        transform: isSelected ? "scale(1.01)" : "scale(1)",
        boxShadow: isSelected ? "var(--shadow-forest)" : "var(--shadow-xs)",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = "var(--saffron)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.transform = "translateY(0)"; } }}
    >
      {isSelected && <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, background: "var(--saffron)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700 }}>✓</div>}
      <div style={{ height: 100, borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "var(--space-md)", position: "relative" }}>
        <img src={block.image} alt={block.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: isSelected ? "rgba(26,46,26,0.4)" : "rgba(0,0,0,0.15)" }} />
        <div style={{ position: "absolute", bottom: 8, left: 8 }}>
          <span style={{ background: "rgba(0,0,0,0.5)", color: "white", fontSize: "0.65rem", padding: "2px 8px", borderRadius: "var(--radius-full)", backdropFilter: "blur(4px)" }}>{block.duration}</span>
        </div>
      </div>
      <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{block.icon}</div>
      <h4 style={{ fontSize: "0.95rem", color: isSelected ? "white" : "var(--ink)", marginBottom: "6px", lineHeight: 1.3 }}>{block.title}</h4>
      <p style={{ fontSize: "0.78rem", color: isSelected ? "rgba(255,255,255,0.7)" : "var(--ink-muted)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {block.description}
      </p>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "var(--space-sm)" }}>
        {block.highlights.slice(0, 2).map(h => (
          <span key={h} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: isSelected ? "rgba(255,255,255,0.15)" : "var(--snow-warm)", color: isSelected ? "rgba(255,255,255,0.8)" : "var(--ink-muted)", fontWeight: 500 }}>{h}</span>
        ))}
      </div>
      {block.overnight && (
        <div style={{ marginTop: "var(--space-sm)", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: isSelected ? "rgba(255,255,255,0.6)" : "var(--ink-muted)" }}>
          🌙 Overnight: <strong style={{ color: isSelected ? "rgba(255,255,255,0.9)" : "var(--saffron)" }}>{block.overnight.charAt(0).toUpperCase() + block.overnight.slice(1)}</strong>
        </div>
      )}
    </div>
  );
}

function HotelCard({ hotel, isSelected, onSelect, mealPlan, onMealChange }) {
  return (
    <div style={{
      border: isSelected ? "2px solid var(--pine)" : "1.5px solid var(--border)",
      borderRadius: "var(--radius-lg)", overflow: "hidden",
      background: "white", cursor: "pointer",
      boxShadow: isSelected ? "var(--shadow-forest)" : "var(--shadow-xs)",
      transition: "all var(--transition)",
    }}>
      <div style={{ position: "relative", height: 140 }} onClick={() => onSelect(hotel)}>
        <img src={hotel.image} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
        {isSelected && (
          <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, background: "var(--pine)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.85rem" }}>✓</div>
        )}
        <div style={{ position: "absolute", bottom: 8, left: 10 }}>
          <div style={{ background: "var(--saffron)", color: "white", fontSize: "0.65rem", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>{hotel.category}</div>
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 10 }}>
          <div style={{ display: "flex", gap: "1px" }}>
            {[...Array(hotel.stars)].map((_, i) => <span key={i} style={{ color: "#ffd700", fontSize: "0.7rem" }}>★</span>)}
          </div>
        </div>
      </div>
      <div style={{ padding: "var(--space-md)" }} onClick={() => onSelect(hotel)}>
        <h4 style={{ fontSize: "0.95rem", marginBottom: "4px", lineHeight: 1.3 }}>{hotel.name}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "var(--space-sm)" }}>
          <span style={{ color: "var(--saffron)", fontSize: "0.8rem" }}>★ {hotel.rating}</span>
          <span style={{ color: "var(--ink-muted)", fontSize: "0.75rem" }}>({hotel.reviews} reviews)</span>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--ink-muted)" }}>📍 {hotel.destination.charAt(0).toUpperCase() + hotel.destination.slice(1)}</span>
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}>
          {hotel.amenities.slice(0, 3).map(a => (
            <span key={a} style={{ fontSize: "0.65rem", background: "var(--snow-warm)", padding: "2px 7px", borderRadius: "var(--radius-full)", color: "var(--ink-muted)" }}>{a}</span>
          ))}
        </div>
      </div>

      {isSelected && (
        <div style={{ padding: "var(--space-md)", borderTop: "1px solid var(--border)", background: "var(--snow-warm)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-muted)", marginBottom: "var(--space-sm)" }}>Meal Plan</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
            {mealPlans.map(mp => (
              <button key={mp.code} onClick={(e) => { e.stopPropagation(); onMealChange(mp.code); }} style={{
                padding: "6px 8px", borderRadius: "var(--radius-md)",
                border: mealPlan === mp.code ? "1.5px solid var(--pine)" : "1px solid var(--border)",
                background: mealPlan === mp.code ? "var(--pine)" : "white",
                color: mealPlan === mp.code ? "white" : "var(--ink-muted)",
                cursor: "pointer", fontSize: "0.72rem", fontWeight: 600, fontFamily: "inherit",
                textAlign: "center", transition: "all var(--transition)",
              }}>
                <div>{mp.icon} {mp.code}</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-sm)", fontSize: "0.8rem", color: "var(--pine)", fontWeight: 600, textAlign: "right" }}>
            ₹{hotel.roomTypes[0][mealPlan?.toLowerCase() || "cp"]?.toLocaleString("en-IN")}/night
          </div>
        </div>
      )}
    </div>
  );
}

export default function PackageBuilder({ navigate, onLogout, initialData }) {
  const pkg = initialData || { nights: 4, days: 5, label: "4N / 5D", description: "Kashmir Classic" };
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    itinerary: {},  // dayIndex -> block
    hotels: {},     // hotelId -> { hotel, mealPlan }
    vehicles: null, // vehicle object
  });

  const days = Array.from({ length: pkg.days }, (_, i) => i + 1);

  const getBlocksForDay = (dayNum) => {
    const prevOvernight = dayNum > 1 ? selections.itinerary[dayNum - 1]?.overnight : null;
    return itineraryBlocks.filter(b => {
      if (dayNum === 1) return b.from === "arrival";
      if (!prevOvernight) return b.day === dayNum;
      return b.from === prevOvernight && b.day === dayNum;
    });
  };

  const selectItinerary = (dayNum, block) => {
    const newSel = { ...selections.itinerary };
    // Clear downstream selections if route changes
    const currentOvernight = newSel[dayNum]?.overnight;
    if (currentOvernight !== block.overnight) {
      for (let d = dayNum + 1; d <= pkg.days; d++) delete newSel[d];
    }
    newSel[dayNum] = block;
    setSelections(s => ({ ...s, itinerary: newSel }));
  };

  const allDaysSelected = days.slice(0, -1).every(d => selections.itinerary[d]);
  const selectedHotels = Object.values(selections.hotels);

  const totalCost = (() => {
    let total = 0;
    selectedHotels.forEach(({ hotel, mealPlan }) => {
      const rt = hotel.roomTypes[0];
      total += (rt[mealPlan?.toLowerCase() || "cp"] || 0) * pkg.nights;
    });
    if (selections.vehicles) total += selections.vehicles.perDayRate * pkg.days;
    return total;
  })();

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole="agent" />

      <div style={{ paddingTop: "64px" }}>
        {/* Page Header */}
        <div style={{ background: "linear-gradient(135deg, var(--pine), var(--deep-water))", padding: "var(--space-xl) 0 var(--space-lg)" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-md)", flexWrap: "wrap" }}>
              <button onClick={() => navigate("agent-dashboard")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: "var(--radius-full)", padding: "6px 14px", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>← Back</button>
              <div className="badge" style={{ background: "rgba(212,130,42,0.2)", color: "var(--saffron-light)" }}>
                {pkg.label} — {pkg.description}
              </div>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.8rem", marginBottom: "var(--space-sm)" }}>Kashmir Package Builder</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Customize itinerary, hotels, and vehicles for your client</p>
          </div>
        </div>

        {/* Sticky step indicator */}
        <div style={{ background: "white", borderBottom: "1px solid var(--border)", position: "sticky", top: 64, zIndex: 100, padding: "var(--space-lg) 0" }}>
          <div className="container">
            <div className="mobile-stack" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)" }}>
              <StepIndicator currentStep={step} />
              {totalCost > 0 && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Running Total</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--pine)", fontWeight: 500 }}>₹{totalCost.toLocaleString("en-IN")}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "var(--space-xl) var(--space-xl)" }}>

          {/* STEP 0: Itinerary */}
          {step === 0 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Build Day-wise Itinerary</h3>
                <p style={{ fontSize: "0.875rem" }}>Select one option for each day. Smart routing suggests next-day options based on your overnight location.</p>
              </div>

              {days.map((dayNum) => {
                const isLastDay = dayNum === pkg.days;
                const blocks = getBlocksForDay(dayNum);
                const isLocked = dayNum > 1 && !selections.itinerary[dayNum - 1];
                const selected = selections.itinerary[dayNum];

                if (isLastDay) {
                  // Departure day
                  const departureDayBlock = itineraryBlocks.find(b => b.icon === "✈");
                  return (
                    <div key={dayNum} style={{ marginBottom: "var(--space-xl)" }}>
                      <div className="mobile-stack" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
                        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--saffron)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, flexShrink: 0 }}>{dayNum}</div>
                          <div>
                            <h4 style={{ fontSize: "1rem", marginBottom: "2px" }}>Day {dayNum} — Departure</h4>
                            <p style={{ fontSize: "0.78rem" }}>Transfer to Srinagar Airport — Tour Concludes</p>
                          </div>
                        </div>
                        <div style={{ marginLeft: "auto", padding: "4px 12px", background: "var(--snow-warm)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", color: "var(--ink-muted)" }}>Fixed</div>
                      </div>
                      <div style={{ padding: "var(--space-md)", background: "linear-gradient(90deg, var(--saffron-pale), var(--snow-warm))", borderRadius: "var(--radius-md)", border: "1px solid rgba(212,130,42,0.2)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                        <span style={{ fontSize: "1.5rem" }}>✈</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{departureDayBlock?.title || "Departure Day"}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>{departureDayBlock?.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={dayNum} style={{ marginBottom: "var(--space-xl)" }}>
                    <div className="mobile-stack" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
                      <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: selected ? "var(--pine)" : isLocked ? "var(--border)" : "var(--saffron)",
                          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.85rem", fontWeight: 700, flexShrink: 0, transition: "all var(--transition)",
                        }}>
                          {selected ? "✓" : dayNum}
                        </div>
                        <div>
                          <h4 style={{ fontSize: "1rem", marginBottom: "2px", color: isLocked ? "var(--ink-muted)" : "var(--ink)" }}>Day {dayNum}</h4>
                          {isLocked ? (
                            <p style={{ fontSize: "0.78rem" }}>Select Day {dayNum - 1} to unlock options</p>
                          ) : blocks.length === 0 ? (
                            <p style={{ fontSize: "0.78rem", color: "var(--saffron)" }}>No options available for this route. Please try a different Day {dayNum - 1} option.</p>
                          ) : (
                            <p style={{ fontSize: "0.78rem" }}>{blocks.length} option{blocks.length > 1 ? "s" : ""} available{selected ? ` — ${selected.title}` : " — Select one"}</p>
                          )}
                        </div>
                      </div>
                      {selected && (
                        <button onClick={() => { const s = { ...selections.itinerary }; delete s[dayNum]; setSelections(prev => ({ ...prev, itinerary: s })); }} style={{ marginLeft: "auto", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", padding: "4px 12px", cursor: "pointer", fontSize: "0.75rem", color: "var(--ink-muted)", fontFamily: "inherit" }}>Change</button>
                      )}
                    </div>

                    {!isLocked && blocks.length > 0 && (
                      <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(blocks.length, 3)}, 1fr)`, gap: "var(--space-md)" }}>
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
                );
              })}

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "var(--space-lg)", borderTop: "1px solid var(--border)" }}>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!allDaysSelected}
                  onClick={() => setStep(1)}
                  style={{ opacity: allDaysSelected ? 1 : 0.5 }}
                >
                  Continue to Hotels →
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Hotels */}
          {step === 1 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Select Hotels</h3>
                <p style={{ fontSize: "0.875rem" }}>Choose accommodation for each destination. Select room type and meal plan.</p>
              </div>

              {/* Filter by destination */}
              {["srinagar", "pahalgam", "gulmarg"].map(dest => {
                const destHotels = hotels.filter(h => h.destination === dest);
                const hasNights = Object.values(selections.itinerary).some(b => b.overnight === dest);
                if (!hasNights && dest !== "srinagar") return null;

                return (
                  <div key={dest} style={{ marginBottom: "var(--space-2xl)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)", flexWrap: "wrap" }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", textTransform: "capitalize" }}>{dest}</h4>
                      <div className="badge badge-forest">{destHotels.length} hotels available</div>
                    </div>
                    <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)" }}>
                      {destHotels.map(hotel => (
                        <HotelCard
                          key={hotel.id} hotel={hotel}
                          isSelected={!!selections.hotels[hotel.id]}
                          onSelect={(h) => {
                            const newH = { ...selections.hotels };
                            if (newH[h.id]) { delete newH[h.id]; }
                            else {
                              // Remove other hotels for same destination
                              Object.keys(newH).forEach(id => { if (newH[id].hotel.destination === h.destination) delete newH[id]; });
                              newH[h.id] = { hotel: h, mealPlan: "CP" };
                            }
                            setSelections(s => ({ ...s, hotels: newH }));
                          }}
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

              <div className="mobile-stack" style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", paddingTop: "var(--space-lg)", borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>Continue to Vehicle →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicles */}
          {step === 2 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Select Vehicle</h3>
                <p style={{ fontSize: "0.875rem" }}>Choose the right vehicle for your group size and comfort level.</p>
              </div>

              <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
                {vehicles.map((v, i) => (
                  <div key={v.id} onClick={() => setSelections(s => ({ ...s, vehicles: s.vehicles?.id === v.id ? null : v }))} style={{
                    background: selections.vehicles?.id === v.id ? "var(--pine)" : "white",
                    border: selections.vehicles?.id === v.id ? "2px solid var(--pine)" : "1.5px solid var(--border)",
                    borderRadius: "var(--radius-lg)", padding: "var(--space-xl)",
                    cursor: "pointer", transition: "all var(--transition)", position: "relative",
                    boxShadow: selections.vehicles?.id === v.id ? "var(--shadow-forest)" : "var(--shadow-xs)",
                  }}
                    onMouseEnter={e => { if (selections.vehicles?.id !== v.id) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; } }}
                    onMouseLeave={e => { if (selections.vehicles?.id !== v.id) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; } }}
                  >
                    {selections.vehicles?.id === v.id && (
                      <div style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, background: "var(--saffron)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem" }}>✓</div>
                    )}
                    <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>{v.image}</div>
                    <h4 style={{ color: selections.vehicles?.id === v.id ? "white" : "var(--ink)", marginBottom: "4px" }}>{v.type}</h4>
                    <p style={{ fontSize: "0.78rem", color: selections.vehicles?.id === v.id ? "rgba(255,255,255,0.6)" : "var(--ink-muted)", marginBottom: "var(--space-md)", lineHeight: 1.5 }}>{v.models}</p>
                    <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
                      {[`👥 ${v.capacity}`, `🧳 ${v.luggage}`].map(t => (
                        <span key={t} style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "var(--radius-full)", background: selections.vehicles?.id === v.id ? "rgba(255,255,255,0.12)" : "var(--snow-warm)", color: selections.vehicles?.id === v.id ? "rgba(255,255,255,0.8)" : "var(--ink-muted)" }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${selections.vehicles?.id === v.id ? "rgba(255,255,255,0.15)" : "var(--border)"}`, paddingTop: "var(--space-md)" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: selections.vehicles?.id === v.id ? "var(--saffron-light)" : "var(--pine)", fontWeight: 500 }}>
                        ₹{v.perDayRate.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: selections.vehicles?.id === v.id ? "rgba(255,255,255,0.5)" : "var(--ink-muted)" }}>per day · {pkg.days} days = ₹{(v.perDayRate * pkg.days).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mobile-stack" style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" disabled={!selections.vehicles} onClick={() => setStep(3)} style={{ opacity: selections.vehicles ? 1 : 0.5 }}>
                  Review Package →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Summary */}
          {step === 3 && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <div style={{ marginBottom: "var(--space-xl)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>Package Summary</h3>
                <p style={{ fontSize: "0.875rem" }}>Review your selections before generating the quotation</p>
              </div>

              <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "var(--space-xl)" }}>
                <div>
                  {/* Itinerary summary */}
                  <div className="card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-lg)" }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Day-wise Itinerary</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                      {days.map(dayNum => {
                        const block = selections.itinerary[dayNum];
                        const isLast = dayNum === pkg.days;
                        return (
                          <div key={dayNum} style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--pine)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>{dayNum}</div>
                              {dayNum < pkg.days && <div style={{ width: 1, height: 32, background: "var(--border)", marginTop: "4px" }} />}
                            </div>
                            <div style={{ flex: 1, paddingBottom: "var(--space-md)" }}>
                              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "2px" }}>Day {dayNum}</div>
                              <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>
                                {isLast ? "Departure — Transfer to Srinagar Airport" : block ? block.title : "Not selected"}
                              </div>
                              {block?.overnight && !isLast && (
                                <div style={{ fontSize: "0.75rem", color: "var(--glacier)", marginTop: "2px" }}>🌙 O/N: {block.overnight.charAt(0).toUpperCase() + block.overnight.slice(1)}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hotels summary */}
                  {selectedHotels.length > 0 && (
                    <div className="card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-lg)" }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Selected Hotels</h4>
                      {selectedHotels.map(({ hotel, mealPlan }) => (
                        <div key={hotel.id} style={{ display: "flex", gap: "var(--space-md)", padding: "var(--space-md) 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
                          <img src={hotel.image} alt={hotel.name} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: "150px" }}>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{hotel.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>{hotel.category} · {mealPlan}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "var(--font-display)", color: "var(--pine)" }}>₹{(hotel.roomTypes[0][mealPlan?.toLowerCase() || "cp"] * pkg.nights).toLocaleString("en-IN")}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>₹{hotel.roomTypes[0][mealPlan?.toLowerCase() || "cp"]?.toLocaleString()} × {pkg.nights}N</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vehicle summary */}
                  {selections.vehicles && (
                    <div className="card" style={{ padding: "var(--space-xl)" }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-lg)" }}>Selected Vehicle</h4>
                      <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ fontSize: "2.5rem" }}>{selections.vehicles.image}</div>
                        <div style={{ flex: 1, minWidth: "150px" }}>
                          <div style={{ fontWeight: 600 }}>{selections.vehicles.type}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>{selections.vehicles.models}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>👥 {selections.vehicles.capacity}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "var(--font-display)", color: "var(--pine)" }}>₹{(selections.vehicles.perDayRate * pkg.days).toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>₹{selections.vehicles.perDayRate.toLocaleString()} × {pkg.days} days</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div>
                  <div className="card" style={{ padding: "var(--space-xl)", position: "sticky", top: "140px" }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "var(--space-lg)" }}>Cost Breakdown</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
                      {selectedHotels.map(({ hotel, mealPlan }) => (
                        <div key={hotel.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                          <span style={{ color: "var(--ink-muted)" }}>{hotel.name.slice(0, 22)}...</span>
                          <span>₹{(hotel.roomTypes[0][mealPlan?.toLowerCase() || "cp"] * pkg.nights).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                      {selections.vehicles && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                          <span style={{ color: "var(--ink-muted)" }}>{selections.vehicles.type} ({pkg.days}D)</span>
                          <span>₹{(selections.vehicles.perDayRate * pkg.days).toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--ink-muted)" }}>GST (5%)</span>
                        <span>₹{Math.round(totalCost * 0.05).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div style={{ borderTop: "2px solid var(--pine)", paddingTop: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 700 }}>Total Package Cost</span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--pine)", fontWeight: 500 }}>
                          ₹{Math.round(totalCost * 1.05).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textAlign: "right" }}>Per person (single occupancy)</div>
                    </div>

                    {/* Client info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
                      <input className="form-input" placeholder="Client Name" style={{ fontSize: "0.875rem" }} />
                      <input className="form-input" placeholder="No. of Adults" type="number" style={{ fontSize: "0.875rem" }} />
                      <input className="form-input" placeholder="Travel Date" type="date" style={{ fontSize: "0.875rem" }} />
                    </div>

                    <button
                      className="btn btn-primary w-full"
                      style={{ justifyContent: "center" }}
                      onClick={() => navigate("quotation", { ...pkg, selections, totalCost })}
                    >
                      Generate Quotation 📋
                    </button>
                    <button className="btn btn-outline w-full" style={{ justifyContent: "center", marginTop: "var(--space-sm)" }}>
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-md)", paddingTop: "var(--space-lg)", borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back to Vehicle</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}