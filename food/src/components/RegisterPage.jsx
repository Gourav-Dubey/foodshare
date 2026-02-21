import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";
import { FaUtensils, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHandHoldingHeart, FaUsers, FaCheck } from "react-icons/fa";

const S = {
  root: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#030d09",
    padding: "32px 16px", position: "relative", overflow: "hidden", isolation: "isolate",
  },
  blob1: {
    position: "absolute", borderRadius: "50%", filter: "blur(90px)",
    width: 400, height: 400, background: "#0a3d1f",
    top: -100, left: -100, zIndex: 0, pointerEvents: "none",
  },
  blob2: {
    position: "absolute", borderRadius: "50%", filter: "blur(90px)",
    width: 300, height: 300, background: "#052910",
    bottom: -80, right: -60, zIndex: 0, pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: 520,
    background: "rgba(5,18,11,0.93)", border: "1px solid rgba(34,197,94,0.12)",
    borderRadius: 20, overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(10,80,35,0.12) inset",
  },
  header: {
    background: "linear-gradient(135deg,#14532d,#166534)",
    padding: "20px 32px", textAlign: "center",
    borderBottom: "1px solid rgba(34,197,94,0.15)",
  },
  headerBrand: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: 700, color: "#ecfdf5", margin: 0 },
  headerSub: { fontSize: 13, color: "rgba(187,247,208,0.6)", marginTop: 4 },
  body: { padding: "20px 32px" },
  error: {
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5", borderRadius: 10, padding: "9px 14px",
    fontSize: 13, textAlign: "center", marginBottom: 16,
  },
  roleWrap: {
    display: "flex", gap: 8, marginBottom: 16,
    background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12,
  },
  roleBtn: (active) => ({
    flex: 1, padding: "8px 12px", borderRadius: 9, border: "none",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    transition: "all .2s",
    background: active ? "rgba(22,163,74,0.2)" : "transparent",
    color: active ? "#4ade80" : "rgba(167,243,208,0.35)",
    boxShadow: active ? "inset 0 0 0 1px rgba(74,222,128,0.25)" : "none",
  }),
  label: {
    display: "block", fontSize: 11, fontWeight: 500,
    letterSpacing: "1.1px", textTransform: "uppercase",
    color: "rgba(74,222,128,0.55)", marginBottom: 6,
  },
  fieldWrap: { position: "relative", marginBottom: 4 },
  icon: {
    position: "absolute", left: 12, top: "50%",
    transform: "translateY(-50%)", color: "rgba(74,222,128,0.35)",
    fontSize: 13, pointerEvents: "none",
  },
  input: (hasErr) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${hasErr ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.12)"}`,
    borderRadius: 11, padding: "10px 38px 10px 36px",
    color: "#d1fae5", fontSize: 14, outline: "none",
    fontFamily: "inherit", caretColor: "#4ade80",
    transition: "border .2s, box-shadow .2s",
  }),
  eyeBtn: {
    position: "absolute", right: 12, top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", color: "rgba(167,243,208,0.3)", cursor: "pointer", padding: 0,
  },
  fieldErr: { fontSize: 12, color: "#fca5a5", marginTop: 4, marginBottom: 6 },
  strengthBar: { height: 3, borderRadius: 2, transition: "width .3s" },
  strengthRow: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(167,243,208,0.4)", marginTop: 4, marginBottom: 6 },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(167,243,208,0.45)", margin: "10px 0" },
  btn: {
    width: "100%", padding: "12px", marginTop: 4,
    background: "linear-gradient(135deg,#14532d,#16a34a)",
    border: "none", borderRadius: 11, color: "#fff",
    fontSize: 15, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 4px 20px rgba(22,163,74,0.25)", fontFamily: "inherit",
  },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" },
  divLine: { flex: 1, height: 1, background: "rgba(34,197,94,0.1)" },
  divText: { fontSize: 12, color: "rgba(167,243,208,0.25)" },
  footer: { textAlign: "center", fontSize: 13, color: "rgba(167,243,208,0.35)" },
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ role: "donor", name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "password") {
      let s = 0;
      if (value.length >= 8) s += 25;
      if (/[A-Z]/.test(value)) s += 25;
      if (/[0-9]/.test(value)) s += 25;
      if (/[^A-Za-z0-9]/.test(value)) s += 25;
      setPasswordStrength(s);
    }
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email is invalid";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        role: formData.role, name: formData.name,
        email: formData.email, password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", formData.role);
      alert("✅ Registration successful!");
      window.location.href = formData.role === "donor" ? "/donor-dashboard" : "/ngo-dashboard";
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ submit: msg });
      setTimeout(() => setErrors({}), 4000);
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = passwordStrength >= 75 ? "#22c55e" : passwordStrength >= 50 ? "#eab308" : passwordStrength >= 25 ? "#f97316" : "#ef4444";
  const strengthText = passwordStrength >= 75 ? "Strong" : passwordStrength >= 50 ? "Medium" : passwordStrength >= 25 ? "Weak" : "Very Weak";

  const onFocus = (e) => { e.target.style.borderColor = "rgba(74,222,128,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; };
  const onBlur = (e) => { e.target.style.borderColor = errors[e.target.name] ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.12)"; e.target.style.boxShadow = "none"; };

  return (
    <div style={S.root}>
      <div style={S.blob1} />
      <div style={S.blob2} />

      <motion.div style={S.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerBrand}>
            <FaUtensils color="#4ade80" size={18} />
            <h1 style={S.headerTitle}>FoodShare</h1>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ecfdf5", margin: 0 }}>Create Account</h2>
          <p style={S.headerSub}>Join us in the fight against hunger</p>
        </div>

        {/* Body */}
        <div style={S.body}>
          {errors.submit && <div style={S.error}>⚠️ {errors.submit}</div>}

          {/* Role Toggle */}
          <div style={S.roleWrap}>
            {["donor", "ngo"].map((r) => (
              <button key={r} type="button" onClick={() => setFormData({ ...formData, role: r })} style={S.roleBtn(formData.role === r)}>
                {r === "donor" ? <FaHandHoldingHeart size={12} /> : <FaUsers size={12} />}
                {r === "donor" ? "Donor" : "NGO"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Two column layout for Name + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <label style={S.label}>Full Name</label>
                <div style={S.fieldWrap}>
                  <FaUser style={S.icon} />
                  <input name="name" type="text" placeholder="Your full name" value={formData.name}
                    onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={S.input(!!errors.name)} required />
                </div>
                {errors.name && <p style={S.fieldErr}>{errors.name}</p>}
              </div>

              <div>
                <label style={S.label}>Email Address</label>
                <div style={S.fieldWrap}>
                  <FaEnvelope style={S.icon} />
                  <input name="email" type="email" placeholder="Your email" value={formData.email}
                    onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={S.input(!!errors.email)} required />
                </div>
                {errors.email && <p style={S.fieldErr}>{errors.email}</p>}
              </div>
            </div>

            {/* Two column layout for Password + Confirm Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <label style={S.label}>Password</label>
                <div style={S.fieldWrap}>
                  <FaLock style={S.icon} />
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Create password"
                    value={formData.password} onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={S.input(!!errors.password)} required />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
                {formData.password && (
                  <>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 2, height: 3, marginTop: 6 }}>
                      <div style={{ ...S.strengthBar, width: `${passwordStrength}%`, background: strengthColor }} />
                    </div>
                    <div style={S.strengthRow}><span>{strengthText}</span><span>{passwordStrength}%</span></div>
                  </>
                )}
                {errors.password && <p style={S.fieldErr}>{errors.password}</p>}
              </div>

              <div>
                <label style={S.label}>Confirm Password</label>
                <div style={S.fieldWrap}>
                  <FaLock style={S.icon} />
                  <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password"
                    value={formData.confirmPassword} onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={S.input(!!errors.confirmPassword)} required />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowConfirmPassword(v => !v)}>
                    {showConfirmPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={S.fieldErr}>{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms */}
            <label style={S.checkRow}>
              <input type="checkbox" required style={{ accentColor: "#22c55e", marginTop: 2, flexShrink: 0 }} />
              <span>I agree to the <a href="/terms" style={{ color: "#4ade80" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#4ade80" }}>Privacy Policy</a></span>
            </label>

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{ ...S.btn, opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? (
                <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Creating...</>
              ) : (
                <><FaCheck size={13} /> Create Account</>
              )}
            </motion.button>
          </form>

          <div style={S.divider}><div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} /></div>

          <p style={S.footer}>Already have an account? <a href="/login" style={{ color: "#4ade80", fontWeight: 500 }}>Sign in</a></p>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RegisterPage;