import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";


// ✅ Field is defined OUTSIDE LoginPage so it doesn't get re-created on every render
const Field = ({ fkey, placeholder, type = "text", icon, form, errors, setForm, setErrors, showPass, setShowPass, onEnter }) => {
  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  return (
    <div style={s.fieldWrap}>
      <div style={s.inputRow}>
        <span style={s.fieldIcon}>{icon}</span>
        <input
          type={fkey === "password" || fkey === "confirm" ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          value={form[fkey]}
          onChange={(e) => set(fkey, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          style={{ ...s.input, ...(errors[fkey] ? s.inputErr : {}) }}
        />
        {fkey === "password" && (
          <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
            {showPass ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {errors[fkey] && <p style={s.errMsg}>{errors[fkey]}</p>}
    </div>
  );
};

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, signup, loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (mode === "login") {
      const ok = loginWithCredentials(form.email, form.password);
      if (!ok) { setErrors({ email: "Invalid email or password" }); toast.error("Invalid email or password"); setLoading(false); return; }
    } else {
      signup({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created successfully");
    }
    setLoading(false);
    navigate(from, { replace: true });
    toast.success("Login successful");
  };

  // Shared props passed down to Field
  const fieldProps = { form, errors, setForm, setErrors, showPass, setShowPass, onEnter: handleSubmit };

  return (
    <div style={s.page}>
      {/* LEFT PANEL */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.shuttleArt}>🏸</div>
          <h1 style={s.brandName}>Mummoorthy<br />Badminton Store</h1>
          <p style={s.brandSub}>Premium rackets, shoes & gear<br />for every level of player</p>
          <div style={s.features}>
            {["🚚 Free shipping over ₹999", "↩ 7-day easy returns", "✅ 100% genuine products", "🔒 Secure payments"].map((f, i) => (
              <div key={i} style={{ ...s.feat, animationDelay: `${i * 0.1}s` }} className="feat">{f}</div>
            ))}
          </div>
        </div>
        {/* decorative circles */}
        <div style={{ ...s.deco, width: 300, height: 300, top: -80, right: -80, opacity: 0.06 }} />
        <div style={{ ...s.deco, width: 180, height: 180, bottom: 100, left: -60, opacity: 0.08 }} />
        <div style={{ ...s.deco, width: 90, height: 90, bottom: 40, right: 60, opacity: 0.1 }} />
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right}>
        <div style={s.formBox}>
          {/* Toggle tabs */}
          <div style={s.tabs}>
            <button onClick={() => { setMode("login"); setErrors({}); }} style={{ ...s.tab, ...(mode === "login" ? s.tabActive : {}) }}>
              Sign In
            </button>
            <button onClick={() => { setMode("signup"); setErrors({}); }} style={{ ...s.tab, ...(mode === "signup" ? s.tabActive : {}) }}>
              Sign Up
            </button>
          </div>

          <h2 style={s.formTitle}>
            {mode === "login" ? "Welcome back 👋" : "Create account ✨"}
          </h2>
          <p style={s.formSub}>
            {mode === "login" ? "Sign in to like products and place orders" : "Join thousands of badminton players"}
          </p>

          <div style={s.fields}>
            {mode === "signup" && (
              <Field fkey="name" placeholder="Full Name" icon="👤" {...fieldProps} />
            )}
            <Field fkey="email" placeholder="Email Address" type="email" icon="✉️" {...fieldProps} />
            <Field fkey="password" placeholder="Password" icon="🔑" {...fieldProps} />
            {mode === "signup" && (
              <Field fkey="confirm" placeholder="Confirm Password" icon="🔐" {...fieldProps} />
            )}
          </div>

          {mode === "login" && (
            <div style={s.forgotRow}>
              <span style={s.forgot}>Forgot password?</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...s.submitBtn, ...(loading ? s.submitLoading : {}) }}
          >
            {loading ? (
              <span style={s.spinner}>⏳ {mode === "login" ? "Signing in..." : "Creating account..."}</span>
            ) : (
              mode === "login" ? "Sign In →" : "Create Account →"
            )}
          </button>

          {/* Divider */}
          <div style={s.dividerRow}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>or continue as</span>
            <div style={s.dividerLine} />
          </div>

          <button onClick={() => navigate("/")} style={s.guestBtn}>
            👀 Browse as Guest
          </button>

          <p style={s.switchText}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); }} style={s.switchLink}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feat { animation: fadeUp 0.5s ease both; }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
  },

  // LEFT
  left: {
    flex: 1,
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
    position: "relative",
    overflow: "hidden",
  },
  leftInner: { position: "relative", zIndex: 2 },
  shuttleArt: { fontSize: "64px", marginBottom: "24px", display: "block" },
  brandName: {
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    lineHeight: 1.1,
    margin: "0 0 14px",
    letterSpacing: "-1px",
  },
  brandSub: { fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 36px" },
  features: { display: "flex", flexDirection: "column", gap: "10px" },
  feat: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  deco: {
    position: "absolute",
    borderRadius: "50%",
    background: "#fff",
  },

  // RIGHT
  right: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    background: "#fff",
  },
  formBox: { width: "100%", maxWidth: "380px" },

  tabs: {
    display: "flex",
    background: "#f3f4f6",
    borderRadius: "12px",
    padding: "4px",
    marginBottom: "28px",
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "none",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#9ca3af",
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
    transition: "all 0.2s",
  },
  tabActive: { background: "#0a0a0a", color: "#fff" },

  formTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0a0a0a",
    margin: "0 0 6px",
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
  },
  formSub: { fontSize: "13px", color: "#9ca3af", margin: "0 0 24px" },

  fields: { display: "flex", flexDirection: "column", gap: "4px" },
  fieldWrap: { marginBottom: "12px" },
  inputRow: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fafafa",
    transition: "border-color 0.2s",
  },
  fieldIcon: { padding: "0 12px", fontSize: "16px", flexShrink: 0 },
  input: {
    flex: 1,
    padding: "13px 12px 13px 0",
    border: "none",
    background: "transparent",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
    color: "#0a0a0a",
  },
  inputErr: { border: "1.5px solid #f44336" },
  eyeBtn: {
    background: "none",
    border: "none",
    padding: "0 12px",
    cursor: "pointer",
    fontSize: "16px",
  },
  errMsg: { fontSize: "11px", color: "#f44336", margin: "4px 0 0 4px" },

  forgotRow: { textAlign: "right", marginBottom: "16px", marginTop: "-4px" },
  forgot: { fontSize: "12px", color: "#6366f1", cursor: "pointer", fontWeight: "600" },

  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#0a0a0a",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
    letterSpacing: "0.3px",
    transition: "opacity 0.2s, transform 0.1s",
    marginBottom: "20px",
  },
  submitLoading: { opacity: 0.7, cursor: "not-allowed" },
  spinner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },

  dividerRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
  dividerLine: { flex: 1, height: "1px", background: "#e5e7eb" },
  dividerText: { fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" },

  guestBtn: {
    width: "100%",
    padding: "13px",
    background: "#fff",
    color: "#0a0a0a",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",  // ✅ changed to Inter
    marginBottom: "20px",
    transition: "background 0.2s",
  },

  switchText: { textAlign: "center", fontSize: "13px", color: "#9ca3af", margin: 0 },
  switchLink: { color: "#0a0a0a", fontWeight: "800", cursor: "pointer" },
};
