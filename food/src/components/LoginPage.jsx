import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const S = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#030d09",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
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
    position: "relative", zIndex: 1,
    width: "100%", maxWidth: 400, margin: 20,
    background: "rgba(5,18,11,0.92)",
    border: "1px solid rgba(34,197,94,0.12)",
    borderRadius: 20, padding: "40px 36px",
    backdropFilter: "blur(16px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(10,80,35,0.15) inset",
  },
  brand: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, marginBottom: 28,
  },
  brandIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "linear-gradient(135deg,#14532d,#16a34a)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, boxShadow: "0 0 16px rgba(22,163,74,0.3)",
  },
  brandName: {
    fontSize: 20, fontWeight: 700, color: "#d1fae5", letterSpacing: -0.3,
  },
  title: {
    fontSize: 26, fontWeight: 700, color: "#ecfdf5",
    textAlign: "center", marginBottom: 4, letterSpacing: -0.4,
  },
  sub: {
    fontSize: 13, color: "rgba(167,243,208,0.35)",
    textAlign: "center", marginBottom: 28,
  },
  error: {
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5", borderRadius: 10, padding: "9px 14px",
    fontSize: 13, textAlign: "center", marginBottom: 18,
  },
  label: {
    display: "block", fontSize: 11, fontWeight: 500,
    letterSpacing: "1.1px", textTransform: "uppercase",
    color: "rgba(74,222,128,0.55)", marginBottom: 6,
  },
  inputWrap: { position: "relative", marginBottom: 16 },
  input: {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(34,197,94,0.12)",
    borderRadius: 11, padding: "12px 40px 12px 14px",
    color: "#d1fae5", fontSize: 14, outline: "none",
    fontFamily: "inherit", caretColor: "#4ade80",
    boxSizing: "border-box", transition: "border .2s, box-shadow .2s",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", color: "rgba(167,243,208,0.3)",
    cursor: "pointer", fontSize: 15, padding: 0,
  },
  btn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg,#14532d,#16a34a)",
    border: "none", borderRadius: 11, color: "#fff",
    fontSize: 15, fontWeight: 500, cursor: "pointer",
    marginTop: 8, letterSpacing: 0.2, fontFamily: "inherit",
    boxShadow: "0 4px 20px rgba(22,163,74,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  footer: {
    textAlign: "center", marginTop: 24,
    fontSize: 13, color: "rgba(167,243,208,0.3)",
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      login(user, user.role, token);
      if (user.role === "ngo") navigate("/ngo-dashboard");
      else if (user.role === "donor") navigate("/donor-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(74,222,128,0.35)";
    e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "rgba(34,197,94,0.12)";
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={S.root}>
        <div style={S.blob1} />
        <div style={S.blob2} />

        <div style={S.card}>
          {/* Brand */}
          <div style={S.brand}>
            <div style={S.brandIcon}>🍽️</div>
            <span style={S.brandName}>FoodShare</span>
          </div>

          <h1 style={S.title}>Welcome back</h1>
          <p style={S.sub}>Sign in to continue sharing meals</p>

          {error && <div style={S.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={S.label}>Email</label>
            <div style={S.inputWrap}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                style={S.input}
                required
              />
            </div>

            <label style={S.label}>Password</label>
            <div style={S.inputWrap}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                style={S.input}
                required
              />
              <button
                type="button"
                style={S.eyeBtn}
                onClick={() => setShowPw((v) => !v)}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...S.btn, opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p style={S.footer}>
            No account?{" "}
            <a href="/register" style={{ color: "#4ade80", textDecoration: "none", fontWeight: 500 }}>
              Register free
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;