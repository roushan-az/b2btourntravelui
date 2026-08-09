import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api"; // Ensure you have this imported for the approval call

export default function QuotationPage({ navigate, onLogout, packageData: incomingData, userRole }) {
  const isFromBuilder = !!incomingData?.state;
  const payload = incomingData?.state || incomingData || {};
  
  // Safe Variable Extraction
  const quoteNo = payload.quoteRef?.quote_number || payload.quote_number || `QT-2024-DRAFT`;
  const clientName = payload.selections?.clientName || payload.client_name || "Valued Guest";
  const travelDate = payload.selections?.travelDate || payload.travel_date || "Not Specified";
  const rawCost = payload.totalCost || payload.total_cost || 0;
  const finalCost = isFromBuilder ? Math.round(rawCost * 1.05) : rawCost;

  // Workflow States
  const [currentStatus, setCurrentStatus] = useState(payload.status || "DRAFT");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // UNIFY THE LAYOUT: Convert Builder selections into the same format as Database items
  let displayItems = [];
  if (isFromBuilder && payload.selections) {
      if (payload.selections.hotels) {
          Object.values(payload.selections.hotels).forEach(({ hotel, mealPlan }) => {
              displayItems.push({ description: `Hotel: ${hotel.name} (${hotel.category})`, detail: `Meal Plan: ${mealPlan}` });
          });
      }
      if (payload.selections.vehicles) {
          displayItems.push({ description: `Vehicle: ${payload.selections.vehicles.vehicle_type}`, detail: payload.selections.vehicles.models });
      }
  } else {
      displayItems = payload.items || [];
  }

  // Admin Approval Handler
  const handleApprove = async () => {
    setIsUpdating(true);
    setUpdateError("");
    try {
      // Assuming you create a PATCH endpoint: /api/v1/quotations/{id}/status
      await api.quotations.update(payload.id, { status: "CONFIRMED" }); 
      setCurrentStatus("CONFIRMED");
    } catch (err) {
      console.error(err);
      setUpdateError("Failed to approve quotation. Please check your backend.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} onLogout={onLogout} userRole={userRole || "agent"} />

      <div style={{ paddingTop: "64px" }}>
        <div className="container" style={{ padding: "var(--space-xl)" }}>
          
{/* Action Buttons */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center" }}>
            <button 
              onClick={() => navigate(userRole === "admin" ? "admin-dashboard" : "agent-dashboard")}
              style={{ background: "transparent", border: "1.5px solid var(--border)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", color: "var(--ink)", fontWeight: 600 }}
            >
              ← Back to Dashboard
            </button>
            
            {/* BOTH Agent and Admin can Edit a Draft */}
            {currentStatus === "DRAFT" && (
              <button 
                onClick={() => navigate("package-builder", incomingData)}
                style={{ background: "var(--pine)", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", color: "white", fontWeight: 600 }}
              >
                ✎ Edit Draft
              </button>
            )}

            {/* ONLY Admin can Approve */}
            {currentStatus === "DRAFT" && userRole === "admin" && (
              <button 
                onClick={handleApprove}
                disabled={isUpdating}
                style={{ background: "var(--saffron)", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", color: "white", fontWeight: 600 }}
              >
                {isUpdating ? "Approving..." : "✓ Approve Quotation"}
              </button>
            )}

            {/* Status Badge */}
            <span style={{ marginLeft: "auto", padding: "6px 16px", borderRadius: "20px", background: currentStatus === "CONFIRMED" ? "#e8f5e9" : "#f5f5f5", color: currentStatus === "CONFIRMED" ? "#2e7d32" : "#8a8a8a", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
              {currentStatus}
            </span>
          </div>

          {updateError && (
             <div style={{ padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>
               {updateError}
             </div>
          )}

          <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            
           <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "20px", marginBottom: "20px" }}>
               <h1>WanderKashmir</h1>
               <div style={{ textAlign: "right" }}>
                  <p><strong>Quotation No:</strong> {quoteNo}</p>
                  <p><strong>Client:</strong> {clientName}</p>
                  <p><strong>Travel Date:</strong> {travelDate}</p>
               </div>
            </div>

            {/* UNIFIED LAYOUT: Always uses the nice boxed layout */}
            <h3>Package Inclusions</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
               {displayItems.length > 0 ? displayItems.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "12px", padding: "12px", background: "var(--snow)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 600, color: "var(--pine)" }}>{item.description}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--ink-muted)", marginTop: "4px" }}>{item.detail}</div>
                  </li>
               )) : (
                  <li style={{ color: "var(--ink-muted)" }}>No item details available.</li>
               )}
            </ul>

            <div style={{ marginTop: "40px", padding: "20px", background: "var(--snow-warm)", borderRadius: "8px" }}>
               <h2>Total Package Cost: ₹{Number(finalCost).toLocaleString("en-IN")}</h2>
               <p style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>*Includes 5% GST</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}