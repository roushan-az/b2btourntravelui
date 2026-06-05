import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { destinations, stats, testimonials, packageDurations } from "../data/mockData";

const heroImages = [
  "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1600&q=85",
  "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?w=1600&q=85",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=85",
];

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const numeric = parseInt(target.replace(/[^0-9]/g, ""));
  useEffect(() => {
    let start = 0;
    const increment = numeric / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numeric) { setCount(numeric); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [numeric]);
  const formatted = target.includes(",") ? count.toLocaleString("en-IN") : count;
  return <span>{target.startsWith("₹") ? "₹" : ""}{formatted}{target.includes("+") ? "+" : ""}{suffix}</span>;
}

export default function LandingPage({ navigate }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)" }}>
      <Navbar navigate={navigate} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        {heroImages.map((img, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover", backgroundPosition: "center",
            transition: "opacity 1.5s ease",
            opacity: i === heroIndex ? 1 : 0,
          }} />
        ))}
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(10,20,10,0.65) 60%, rgba(10,20,10,0.85) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)" }} />

        {/* Hero Content */}
        <div style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          textAlign: "center", padding: "0 var(--space-xl)",
          paddingTop: "64px",
        }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 1s ease 0.2s" }}>
            <div className="badge badge-saffron" style={{ marginBottom: "var(--space-lg)", fontSize: "0.7rem" }}>
              🏔 Exclusive B2B Travel Platform — Kashmir
            </div>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", color: "white",
            fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 400,
            lineHeight: 1.05, marginBottom: "var(--space-lg)",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 1s ease 0.4s", maxWidth: "900px",
          }}>
            Build Kashmir Packages<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>in Minutes, Not Hours</em>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: "1.1rem",
            maxWidth: "560px", lineHeight: 1.8,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 1s ease 0.6s", marginBottom: "var(--space-xl)",
          }}>
            The most intelligent drag-and-drop itinerary builder for travel agents.
            Smart routing, auto-pricing, professional quotations — all in one platform.
          </p>

          <div style={{
            display: "flex", gap: "var(--space-md)", flexWrap: "wrap", justifyContent: "center",
            opacity: visible ? 1 : 0, transition: "all 1s ease 0.8s",
          }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("login")}>
              Start Building Packages →
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </button>
          </div>

          {/* Trust bar */}
          <div style={{
            marginTop: "var(--space-2xl)",
            display: "flex", gap: "var(--space-xl)", flexWrap: "wrap", justifyContent: "center",
            opacity: visible ? 1 : 0, transition: "all 1s ease 1s",
          }}>
            {["1,200+ Agents", "45,000+ Packages Built", "₹48 Cr+ Revenue Generated"].map(t => (
              <div key={t} style={{
                display: "flex", alignItems: "center", gap: "6px",
                color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 500,
              }}>
                <span style={{ color: "var(--saffron-light)" }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Hero dots */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 3 }}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)} style={{
              width: i === heroIndex ? 24 : 8, height: 8,
              borderRadius: 4, background: i === heroIndex ? "var(--saffron)" : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer", transition: "all var(--transition)",
            }} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "2rem", right: "2rem", zIndex: 3,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.1em",
        }}>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.3)", animation: "pulse 2s ease infinite" }} />
          SCROLL
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "var(--pine)", padding: "var(--space-2xl) 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3vw, 3rem)",
                  color: "var(--saffron-light)", fontWeight: 500, marginBottom: "4px",
                }}>
                  <AnimatedCounter target={s.value} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", letterSpacing: "0.04em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features" style={{ padding: "var(--space-3xl) 0", background: "var(--snow)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
            <div className="badge badge-forest" style={{ marginBottom: "var(--space-md)" }}>Platform Workflow</div>
            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-md)" }}>Build a Package in 4 Simple Steps</h2>
            <p style={{ maxWidth: "480px", margin: "0 auto" }}>From itinerary selection to final quotation — our intelligent workflow guides agents through every step.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-lg)", position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: "52px", left: "calc(12.5% + 24px)", right: "calc(12.5% + 24px)", height: "1px", background: "linear-gradient(90deg, transparent, var(--border-strong), transparent)", zIndex: 0 }} />

            {[
              { step: "01", icon: "📅", title: "Select Duration", desc: "Choose from 3N/4D to 7N/8D package options with instant pricing estimates." },
              { step: "02", icon: "🗺", title: "Build Itinerary", desc: "Drag and drop day-wise activities. Smart routing suggests logical next-day options." },
              { step: "03", icon: "🏨", title: "Choose Hotels", desc: "Select hotels by destination, room type, and meal plan. Live pricing updates." },
              { step: "04", icon: "📋", title: "Generate Quote", desc: "Instant professional quotation with automatic cost calculation. Share with client." },
            ].map((step, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "var(--space-xl) var(--space-lg)",
                background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)", position: "relative", zIndex: 1,
                animation: `fadeInUp 0.6s ease ${i * 0.15}s both`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, var(--saffron-pale), white)",
                  border: "1.5px solid rgba(212,130,42,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", margin: "0 auto var(--space-md)",
                  boxShadow: "var(--shadow-sm)",
                }}>{step.icon}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--saffron)", marginBottom: "var(--space-sm)", textTransform: "uppercase" }}>Step {step.step}</div>
                <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-sm)", fontSize: "1.15rem" }}>{step.title}</h4>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section id="destinations" style={{ padding: "var(--space-3xl) 0", background: "var(--snow-warm)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
            <div className="badge badge-glacier" style={{ marginBottom: "var(--space-md)" }}>Kashmir Destinations</div>
            <h2 style={{ fontFamily: "var(--font-display)" }}>Heaven on Earth,<br /><em>Curated for Your Clients</em></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gridTemplateRows: "280px 280px", gap: "var(--space-md)" }}>
            {destinations.slice(0, 5).map((dest, i) => (
              <div key={dest.id} style={{
                gridRow: i === 0 ? "1 / 3" : "auto",
                borderRadius: "var(--radius-lg)", overflow: "hidden",
                position: "relative", cursor: "pointer",
                boxShadow: "var(--shadow-md)",
              }}
                className="card"
              >
                <img src={dest.image} alt={dest.name} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 0.8s ease",
                }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)",
                }} />
                <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>{dest.region}</div>
                  <div style={{ fontFamily: "var(--font-display)", color: "white", fontSize: i === 0 ? "2rem" : "1.4rem", fontWeight: 500 }}>{dest.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGE DURATIONS ── */}
      <section style={{ padding: "var(--space-3xl) 0", background: "var(--snow)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--space-sm)" }}>Package Options</h2>
            <p>Choose the right duration for every client, every budget</p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
            {packageDurations.map((pkg, i) => (
              <div key={i} style={{
                background: pkg.popular ? "var(--pine)" : "white",
                color: pkg.popular ? "white" : "var(--ink)",
                border: pkg.popular ? "none" : "1.5px solid var(--border)",
                borderRadius: "var(--radius-xl)", padding: "var(--space-xl) var(--space-lg)",
                textAlign: "center", minWidth: "170px", position: "relative",
                boxShadow: pkg.popular ? "var(--shadow-forest)" : "var(--shadow-xs)",
                cursor: "pointer", transition: "all var(--transition)",
              }}
                onMouseEnter={e => { if (!pkg.popular) { e.currentTarget.style.borderColor = "var(--saffron)"; e.currentTarget.style.transform = "translateY(-4px)"; } }}
                onMouseLeave={e => { if (!pkg.popular) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; } }}
              >
                {pkg.popular && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "var(--saffron)", color: "white", padding: "2px 12px",
                    borderRadius: "var(--radius-full)", fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>Most Popular</div>
                )}
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 500, lineHeight: 1, marginBottom: "4px" }}>{pkg.nights}N</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "var(--space-sm)", opacity: 0.8 }}>{pkg.days} Days</div>
                <div style={{ fontSize: "0.8rem", opacity: pkg.popular ? 0.8 : 0.6, fontWeight: 500 }}>{pkg.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section style={{ padding: "var(--space-3xl) 0", background: "var(--pine)", overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3xl)", alignItems: "center" }}>
            <div>
              <div className="badge" style={{ background: "rgba(212,130,42,0.15)", color: "var(--saffron-light)", marginBottom: "var(--space-lg)" }}>Admin Features</div>
              <h2 style={{ fontFamily: "var(--font-display)", color: "white", marginBottom: "var(--space-lg)" }}>
                Powerful Admin Panel.<br /><em style={{ color: "var(--glacier-light)" }}>Complete Control.</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "var(--space-xl)", lineHeight: 1.8 }}>
                Manage destinations, itineraries, hotels, vehicles, and pricing from one powerful dashboard. Set agent-specific markup, control price visibility, and track every quotation in real-time.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {[
                  { icon: "🏔", text: "Destination & Itinerary Management with smart route logic" },
                  { icon: "🏨", text: "Hotel management with seasonal pricing & meal plans" },
                  { icon: "🚗", text: "Vehicle fleet management with per-day & per-km rates" },
                  { icon: "💰", text: "Agent-specific pricing, markup & profit visibility controls" },
                  { icon: "📊", text: "Real-time analytics, booking history & revenue reports" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)" }}>
                    <div style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: "2px" }}>{f.icon}</div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature cards visual */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              {[
                { icon: "🗺", title: "Smart Route Logic", desc: "AI-suggested next-day options based on overnight location" },
                { icon: "💎", title: "Hidden Pricing", desc: "Agents see total cost only — margins stay protected" },
                { icon: "📱", title: "Quick Quotations", desc: "Professional PDF quotes generated in under 30 seconds" },
                { icon: "📅", title: "Seasonal Rates", desc: "Automatic summer/winter/peak pricing adjustments" },
                { icon: "🔄", title: "Drag & Drop", desc: "Intuitive itinerary building with real-time cost updates" },
                { icon: "🌏", title: "Scalable", desc: "Ready for Ladakh, Himachal, Kerala, and more" },
              ].map((f, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-lg)",
                  padding: "var(--space-lg)", border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)", transition: "all var(--transition)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: "1.6rem", marginBottom: "var(--space-sm)" }}>{f.icon}</div>
                  <div style={{ color: "white", fontWeight: 600, marginBottom: "4px", fontSize: "0.9rem" }}>{f.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: "var(--space-3xl) 0", background: "var(--snow-warm)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
            <div className="badge badge-saffron" style={{ marginBottom: "var(--space-md)" }}>Agent Stories</div>
            <h2 style={{ fontFamily: "var(--font-display)" }}>Trusted by India's<br /><em>Best Travel Agents</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
            {testimonials.map((t, i) => (
              <div key={t.id} className="card" style={{ padding: "var(--space-xl)", animation: `fadeInUp 0.6s ease ${i * 0.15}s both` }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "var(--space-md)" }}>
                  {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: "var(--saffron)", fontSize: "0.875rem" }}>★</span>)}
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--ink-soft)", marginBottom: "var(--space-lg)", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--border)" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, var(--pine) 0%, var(--glacier) 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: "0.875rem",
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.9rem" }}>{t.name}</div>
                    <div style={{ color: "var(--ink-muted)", fontSize: "0.78rem" }}>{t.company} · {t.city}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--saffron)", fontWeight: 500 }}>{t.packages}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)" }}>packages</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "var(--space-3xl) 0",
        background: "linear-gradient(135deg, var(--pine) 0%, var(--deep-water) 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(212,130,42,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(122,158,142,0.1)", pointerEvents: "none" }} />

        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "white", fontWeight: 400, lineHeight: 1.15, marginBottom: "var(--space-lg)" }}>
            Ready to Transform<br /><em style={{ color: "var(--saffron-light)" }}>Your Kashmir Business?</em>
          </div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.1rem", marginBottom: "var(--space-xl)", maxWidth: "500px", margin: "0 auto var(--space-xl)" }}>
            Join 1,200+ travel agents already building smarter Kashmir packages with WanderKashmir.
          </p>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("login")}>
              Request Agent Access
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate("login")}>
              Admin Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d1a0d", padding: "var(--space-2xl) 0 var(--space-lg)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "var(--space-2xl)", paddingBottom: "var(--space-xl)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-md)" }}>
                <div style={{ fontSize: "1.5rem" }}>⛰</div>
                <div style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.2rem" }}>WanderKashmir</div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", lineHeight: 1.8, maxWidth: "280px" }}>
                India's leading B2B Kashmir travel platform. Empowering travel agents with smart tools to sell more and earn more.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Agent Portal", "Admin Dashboard", "Package Builder", "Quotation Engine"] },
              { title: "Destinations", links: ["Srinagar", "Gulmarg", "Pahalgam", "Sonmarg"] },
              { title: "Support", links: ["Agent Onboarding", "Help Center", "Contact Us", "Privacy Policy"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "var(--space-md)" }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {col.links.map(l => (
                    <span key={l} style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", cursor: "pointer", transition: "color var(--transition)" }}
                      onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
                    >{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: "var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>© 2024 WanderKashmir. All rights reserved.</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Built with ❤ for Kashmir Tourism</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
