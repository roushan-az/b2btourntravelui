import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api, { tokenStore } from "../api/api";

// ── Step indicator for the forgot-password flow ────────────────────────────
const RESET_STEPS = ["Email", "Verify OTP", "New Password"];

function ResetStepBar({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: "var(--space-xl)" }}>
      {RESET_STEPS.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < step ? "var(--pine)" : i === step ? "var(--saffron)" : "var(--border)",
              color: i <= step ? "white" : "var(--ink-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: i < step ? "0.85rem" : "0.78rem", fontWeight: 700,
              transition: "all 0.3s",
              boxShadow: i === step ? "0 0 0 4px rgba(212,130,42,0.18)" : "none",
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: "0.65rem", fontWeight: i === step ? 700 : 400,
              color: i === step ? "var(--saffron)" : i < step ? "var(--pine)" : "var(--ink-muted)",
              letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap",
            }}>{s}</span>
          </div>
          {i < RESET_STEPS.length - 1 && (
            <div style={{
              width: 56, height: 2, margin: "0 4px", marginBottom: 22,
              background: i < step ? "var(--pine)" : "var(--border)",
              transition: "all 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── OTP input — 6 individual boxes ────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = digits.map((d, idx) => (idx === i ? "" : d));
      onChange(next.join(""));
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    if (!ch) return;
    const next = digits.map((d, idx) => (idx === i ? ch : d));
    onChange(next.join(""));
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    const nextIdx = Math.min(pasted.length, 5);
    inputs.current[nextIdx]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "var(--space-lg) 0" }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          style={{
            width: 48, height: 56,
            textAlign: "center",
            fontSize: "1.5rem", fontWeight: 700,
            border: `2px solid ${d ? "var(--pine)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            background: d ? "var(--snow-warm)" : "white",
            outline: "none",
            transition: "all 0.2s",
            caretColor: "var(--saffron)",
            color: "var(--pine)",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--saffron)")}
          onBlur={e => (e.target.style.borderColor = d ? "var(--pine)" : "var(--border)")}
        />
      ))}
    </div>
  );
}

// ── Countdown timer ────────────────────────────────────────────────────────
function Countdown({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onExpire(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const pct = (remaining / seconds) * 100;
  return (
    <div style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: `conic-gradient(var(--saffron) ${pct}%, var(--border) ${pct}%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto var(--space-sm)",
        position: "relative",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600,
          color: remaining <= 30 ? "#c62828" : "var(--pine)",
        }}>
          {m}:{String(s).padStart(2, "0")}
        </div>
      </div>
      <div style={{ fontSize: "0.75rem", color: remaining <= 30 ? "#c62828" : "var(--ink-muted)" }}>
        {remaining > 0 ? `OTP expires in ${m}:${String(s).padStart(2, "0")}` : "OTP expired"}
      </div>
    </div>
  );
}

// ── Password strength meter ────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters",        pass: password.length >= 8 },
    { label: "Uppercase letter",      pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter",      pass: /[a-z]/.test(password) },
    { label: "Number",                pass: /\d/.test(password) },
    { label: "Special char (!@#$...)",pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const levels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["", "#ef5350", "#ff9800", "#ffc107", "#66bb6a", "#4caf50"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= score ? colors[score] : "var(--border)", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize: "0.65rem", color: c.pass ? "#4caf50" : "var(--ink-muted)" }}>
              {c.pass ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: colors[score], flexShrink: 0 }}>{levels[score]}</span>
        )}
      </div>
    </div>
  );
}

// ── Main LoginPage ─────────────────────────────────────────────────────────
export default function LoginPage({ onLogin, navigate }) {
  const [tab, setTab]         = useState("agent");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Forgot password state
  const [mode, setMode]               = useState("login");      // "login" | "forgot"
  const [resetStep, setResetStep]     = useState(0);            // 0=email 1=otp 2=newpass
  const [resetEmail, setResetEmail]   = useState("");
  const [otp, setOtp]                 = useState("");
  const [resetToken, setResetToken]   = useState("");
  const [newPassword, setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpExpired, setOtpExpired]   = useState(false);
  const [resetLoading, setResetLoad]  = useState(false);
  const [resetError, setResetError]   = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resendCooldown, setResendCD]   = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCD(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Login submit ─────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    try {
      const data = await api.auth.login(email, password);
      tokenStore.set(data.access_token);
      tokenStore.setRefresh(data.refresh_token);
      const me = await api.auth.me();
      onLogin(me.role === "super_admin" ? "admin" : "agent");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset: Step 1 — Request OTP ──────────────────────────────────────────
  const handleRequestOtp = async () => {
    if (!resetEmail) { setResetError("Please enter your email address."); return; }
    setResetLoad(true); setResetError("");
    try {
      await api.auth.forgotPassword(resetEmail);
      setResetStep(1);
      setOtp("");
      setOtpExpired(false);
      setResendCD(60);
    } catch (err) {
      setResetError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setResetLoad(false);
    }
  };

  // ── Reset: Resend OTP ────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setResetLoad(true); setResetError("");
    try {
      await api.auth.forgotPassword(resetEmail);
      setOtp("");
      setOtpExpired(false);
      setResendCD(60);
      setResetError("");
    } catch (err) {
      setResetError("Failed to resend OTP. Please try again.");
    } finally {
      setResetLoad(false);
    }
  };

  // ── Reset: Step 2 — Verify OTP ───────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.replace(/\D/g, "").length < 6) { setResetError("Please enter all 6 digits."); return; }
    if (otpExpired) { setResetError("OTP has expired. Please request a new one."); return; }
    setResetLoad(true); setResetError("");
    try {
      const data = await api.auth.verifyOtp(resetEmail, otp.replace(/\D/g, ""));
      setResetToken(data.reset_token);
      setResetStep(2);
    } catch (err) {
      setResetError(err.message || "Incorrect OTP. Please try again.");
      setOtp("");
    } finally {
      setResetLoad(false);
    }
  };

  // ── Reset: Step 3 — Set new password ─────────────────────────────────────
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) { setResetError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPass) { setResetError("Passwords do not match."); return; }
    setResetLoad(true); setResetError("");
    try {
      await api.auth.resetPassword(resetToken, newPassword, confirmPass);
      setResetSuccess("✅ Password reset successfully! You can now sign in.");
      setTimeout(() => {
        setMode("login");
        setResetStep(0);
        setResetEmail(""); setOtp(""); setResetToken("");
        setNewPass(""); setConfirmPass(""); setResetSuccess("");
      }, 2500);
    } catch (err) {
      setResetError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setResetLoad(false);
    }
  };

  const handleBackToLogin = () => {
    setMode("login"); setResetStep(0); setResetError("");
    setResetEmail(""); setOtp(""); setResetToken("");
    setNewPass(""); setConfirmPass("");
  };

  // ── Spinner ──────────────────────────────────────────────────────────────
  const Spinner = () => (
    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)", display: "flex", flexDirection: "column" }}>
      <Navbar navigate={navigate} />

      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--space-2xl) var(--space-xl)", paddingTop: "100px",
        background: "linear-gradient(135deg, var(--snow) 0%, var(--snow-warm) 100%)",
      }}>
        <div style={{ width: "100%", maxWidth: 480, animation: "fadeInUp 0.5s ease" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "18px",
              background: mode === "forgot"
                ? "linear-gradient(135deg, var(--saffron) 0%, #e8a045 100%)"
                : "linear-gradient(135deg, var(--pine) 0%, var(--glacier) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", margin: "0 auto var(--space-md)",
              boxShadow: mode === "forgot" ? "0 4px 24px rgba(212,130,42,0.35)" : "var(--shadow-forest)",
              transition: "all 0.4s",
            }}>
              {mode === "forgot" ? "🔑" : "⛰"}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "4px" }}>WanderKashmir</h2>
            <p style={{ fontSize: "0.875rem" }}>
              {mode === "forgot" ? "Reset your password" : "Sign in to your portal"}
            </p>
          </div>

          {/* ────────────────── LOGIN MODE ────────────────── */}
          {mode === "login" && (
            <>
              {/* Tab switcher */}
              <div style={{ display: "flex", background: "var(--snow-warm)", borderRadius: "var(--radius-full)", padding: "4px", marginBottom: "var(--space-xl)", border: "1px solid var(--border)" }}>
                {["agent", "admin"].map(t => (
                  <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
                    flex: 1, padding: "0.6rem 1rem", borderRadius: "var(--radius-full)", border: "none",
                    background: tab === t ? (t === "admin" ? "var(--pine)" : "var(--saffron)") : "transparent",
                    color: tab === t ? "white" : "var(--ink-muted)",
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem",
                    letterSpacing: "0.04em", cursor: "pointer", transition: "all var(--transition)", textTransform: "uppercase",
                  }}>
                    {t === "agent" ? "🧑‍💼 Sub-Agent" : "🛡 Super Admin"}
                  </button>
                ))}
              </div>

              {/* Form card */}
              <div className="card" style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "4px", fontSize: "1.6rem" }}>
                  {tab === "agent" ? "Agent Sign In" : "Admin Sign In"}
                </h3>
                <p style={{ fontSize: "0.875rem", marginBottom: "var(--space-xl)" }}>
                  {tab === "agent" ? "Build packages · Generate quotations" : "Manage portal content & pricing"}
                </p>

                {error && (
                  <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span>⚠</span><span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" placeholder={tab === "agent" ? "agent@example.com" : "admin@wanderkashmir.com"} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input type={showNew ? "text" : "password"} className="form-input" placeholder="••••••••" value={password} onChange={e => setPass(e.target.value)} autoComplete="current-password" style={{ paddingRight: 44, width: "100%", boxSizing: "border-box" }} />
                        <button type="button" onClick={() => setShowNew(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", color: "var(--ink-muted)", padding: 4 }}>
                          {showNew ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button type="button" onClick={() => { setMode("forgot"); setResetEmail(email); setResetError(""); }}
                        style={{ fontSize: "0.8rem", color: "var(--saffron)", cursor: "pointer", fontWeight: 600, background: "none", border: "none", padding: 0, fontFamily: "inherit" }}>
                        Forgot password?
                      </button>
                    </div>

                    <button type="submit" className={`btn ${tab === "admin" ? "btn-forest" : "btn-primary"} w-full`} style={{ justifyContent: "center", padding: "0.9rem" }} disabled={loading}>
                      {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Spinner /> Signing in…</span> : `Sign In as ${tab === "agent" ? "Agent" : "Admin"}`}
                    </button>
                  </div>
                </form>

                {/* Demo credentials */}
                <div style={{ marginTop: "var(--space-lg)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", background: "var(--snow-warm)", border: "1px dashed var(--border-strong)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 6 }}>Demo Credentials</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>Admin: <strong style={{ color: "var(--ink)" }}>admin@wanderkashmir.com</strong> / <strong>admin@2024</strong></div>
                  <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginTop: 2 }}>Agent: <strong style={{ color: "var(--ink)" }}>demo@wanderkashmir.com</strong> / <strong>demo1234</strong></div>
                </div>
              </div>

              <p style={{ textAlign: "center", marginTop: "var(--space-lg)", fontSize: "0.875rem" }}>
                Don't have access?{" "}
                <span style={{ color: "var(--saffron)", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("register")}>Request Agent Account</span>
              </p>
              <button onClick={() => navigate("landing")} style={{ display: "block", margin: "var(--space-md) auto 0", background: "none", border: "none", cursor: "pointer", color: "var(--ink-muted)", fontSize: "0.8rem", fontFamily: "inherit" }}>← Back to homepage</button>
            </>
          )}

          {/* ────────────────── FORGOT PASSWORD MODE ────────────────── */}
          {mode === "forgot" && (
            <div className="card" style={{ padding: "var(--space-xl)", borderRadius: "var(--radius-xl)", animation: "fadeInUp 0.4s ease" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-xl)" }}>
                <button onClick={handleBackToLogin} style={{ background: "var(--snow-warm)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", width: 32, height: 32, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-muted)", flexShrink: 0 }}>←</button>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: 2 }}>Reset Password</h3>
                  <p style={{ fontSize: "0.8rem" }}>
                    {resetStep === 0 && "Enter your registered email address"}
                    {resetStep === 1 && `OTP sent to ${resetEmail}`}
                    {resetStep === 2 && "Create your new password"}
                  </p>
                </div>
              </div>

              <ResetStepBar step={resetStep} />

              {/* Success message */}
              {resetSuccess && (
                <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "var(--radius-md)", padding: "var(--space-md)", color: "#2e7d32", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "1.1rem" }}>✅</span><span>{resetSuccess}</span>
                </div>
              )}

              {/* Error message */}
              {resetError && (
                <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "var(--radius-md)", padding: "var(--space-md)", color: "#c62828", fontSize: "0.875rem", marginBottom: "var(--space-md)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span>⚠</span><span>{resetError}</span>
                </div>
              )}

              {/* ── STEP 0: Email ── */}
              {resetStep === 0 && (
                <div style={{ animation: "fadeInUp 0.35s ease" }}>
                  <div style={{ background: "var(--saffron-pale)", borderRadius: "var(--radius-md)", padding: "var(--space-md)", marginBottom: "var(--space-lg)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>ℹ️</span>
                    <p style={{ fontSize: "0.8rem", color: "var(--ink-muted)", lineHeight: 1.65 }}>
                      Enter your registered email. We'll send a 6-digit OTP to verify your identity before resetting your password.
                    </p>
                  </div>
                  <div className="form-group" style={{ marginBottom: "var(--space-lg)" }}>
                    <label className="form-label">Registered Email Address</label>
                    <input type="email" className="form-input" placeholder="your@email.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRequestOtp()} autoFocus />
                  </div>
                  <button onClick={handleRequestOtp} disabled={resetLoading || !resetEmail} className="btn btn-primary w-full" style={{ justifyContent: "center", padding: "0.9rem", opacity: resetEmail ? 1 : 0.55 }}>
                    {resetLoading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Spinner /> Sending OTP…</span> : "Send OTP →"}
                  </button>
                </div>
              )}

              {/* ── STEP 1: OTP Verification ── */}
              {resetStep === 1 && (
                <div style={{ animation: "fadeInUp 0.35s ease" }}>
                  {/* Countdown */}
                  <Countdown seconds={600} onExpire={() => setOtpExpired(true)} />

                  <div style={{ textAlign: "center", marginBottom: "var(--space-sm)" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: 1.65 }}>
                      Enter the 6-digit OTP sent to<br />
                      <strong style={{ color: "var(--pine)" }}>{resetEmail}</strong>
                    </p>
                  </div>

                  <OtpInput value={otp} onChange={setOtp} disabled={resetLoading || otpExpired} />

                  {otpExpired && (
                    <div style={{ background: "#fff3e0", border: "1px solid #ffcc80", borderRadius: "var(--radius-md)", padding: "var(--space-md)", marginBottom: "var(--space-md)", textAlign: "center", fontSize: "0.85rem", color: "#e65100" }}>
                      ⏱ OTP has expired. Please request a new one.
                    </div>
                  )}

                  <button onClick={handleVerifyOtp} disabled={resetLoading || otp.length < 6 || otpExpired} className="btn btn-primary w-full" style={{ justifyContent: "center", padding: "0.9rem", opacity: otp.length >= 6 && !otpExpired ? 1 : 0.55, marginBottom: "var(--space-md)" }}>
                    {resetLoading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Spinner /> Verifying…</span> : "Verify OTP →"}
                  </button>

                  {/* Resend */}
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>Didn't receive it? </span>
                    <button onClick={handleResendOtp} disabled={resendCooldown > 0 || resetLoading} style={{
                      background: "none", border: "none", cursor: resendCooldown > 0 ? "default" : "pointer",
                      fontFamily: "inherit", fontSize: "0.8rem",
                      color: resendCooldown > 0 ? "var(--ink-muted)" : "var(--saffron)",
                      fontWeight: 600, padding: 0,
                    }}>
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: New Password ── */}
              {resetStep === 2 && (
                <div style={{ animation: "fadeInUp 0.35s ease" }}>
                  <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "var(--radius-md)", padding: "var(--space-md)", marginBottom: "var(--space-lg)", display: "flex", gap: 8, alignItems: "center" }}>
                    <span>✅</span>
                    <span style={{ fontSize: "0.82rem", color: "#2e7d32" }}>Identity verified! Create your new password below.</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
                    <label className="form-label">New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNew ? "text" : "password"}
                        className="form-input"
                        placeholder="Minimum 8 characters"
                        value={newPassword}
                        onChange={e => setNewPass(e.target.value)}
                        style={{ paddingRight: 44 }}
                        autoFocus
                      />
                      <button type="button" onClick={() => setShowNew(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", color: "var(--ink-muted)", padding: 4 }}>
                        {showNew ? "🙈" : "👁"}
                      </button>
                    </div>
                    <PasswordStrength password={newPassword} />
                  </div>

                  <div className="form-group" style={{ marginBottom: "var(--space-xl)" }}>
                    <label className="form-label">Confirm New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="form-input"
                        placeholder="Re-enter your new password"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        style={{ paddingRight: 44, borderColor: confirmPass && newPassword !== confirmPass ? "#ef5350" : confirmPass && newPassword === confirmPass ? "#4caf50" : undefined }}
                      />
                      <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", color: "var(--ink-muted)", padding: 4 }}>
                        {showConfirm ? "🙈" : "👁"}
                      </button>
                    </div>
                    {confirmPass && newPassword !== confirmPass && (
                      <div style={{ fontSize: "0.75rem", color: "#ef5350", marginTop: 4 }}>✗ Passwords do not match</div>
                    )}
                    {confirmPass && newPassword === confirmPass && (
                      <div style={{ fontSize: "0.75rem", color: "#4caf50", marginTop: 4 }}>✓ Passwords match</div>
                    )}
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading || !newPassword || newPassword !== confirmPass || newPassword.length < 8}
                    className="btn btn-primary w-full"
                    style={{ justifyContent: "center", padding: "0.9rem", opacity: newPassword.length >= 8 && newPassword === confirmPass ? 1 : 0.55 }}
                  >
                    {resetLoading
                      ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Spinner /> Resetting…</span>
                      : "🔒 Reset Password"}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}