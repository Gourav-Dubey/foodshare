import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaUtensils } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onAIOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDashboardClick = () => {
    if (user?.role === "donor") navigate("/donor-dashboard");
    else if (user?.role === "ngo") navigate("/ngo-dashboard");
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    if (user?.role) {
      handleDashboardClick();
    } else {
      navigate("/login");
      setIsOpen(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50,
      height: 64,
      background: scrolled
        ? "rgba(4,22,10,0.96)"
        : "rgba(4,20,9,0.82)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: scrolled
        ? "1px solid rgba(34,197,94,0.25)"
        : "1px solid rgba(34,197,94,0.12)",
      boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
      transition: "all 0.3s ease",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      backgroundImage: "linear-gradient(135deg, rgba(20,83,45,0.08) 0%, rgba(5,46,22,0.05) 100%)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 24px", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
            border: "1px solid rgba(74,222,128,0.2)",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <FaUtensils style={{ color: "#fff", fontSize: 16 }} />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f0fdf4", letterSpacing: "-0.02em" }}>
            FoodShare
          </span>
        </Link>

        {/* Desktop Center Buttons */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          position: "absolute", left: "50%", transform: "translateX(-50%)",
        }}
          className="hide-mobile"
        >
          {user ? (
            <>
              <button
                onClick={handleDashboardClick}
                style={{
                  padding: "8px 20px", borderRadius: 10,
                  background: "rgba(22,163,74,0.1)",
                  border: "1px solid rgba(74,222,128,0.25)",
                  color: "#4ade80", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(22,163,74,0.2)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(22,163,74,0.1)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"; }}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 20px", borderRadius: 10,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                style={{
                  padding: "8px 20px", borderRadius: 10,
                  background: "transparent",
                  border: "1px solid rgba(74,222,128,0.25)",
                  color: "#4ade80", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(22,163,74,0.1)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"; }}
              >
                Login
              </button>
              <button
                onClick={handleRegisterClick}
                style={{
                  padding: "8px 20px", borderRadius: 10,
                  background: "linear-gradient(135deg, #14532d, #16a34a)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  color: "#fff", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.25)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Desktop Right — AI Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }} className="hide-mobile">
          <button
            onClick={onAIOpen}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 18px", borderRadius: 10,
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.2)",
              color: "#4ade80", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.16)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.2)"; }}
          >
            🤖 AI
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="show-mobile"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.15)",
            borderRadius: 10, padding: 8,
            color: "#4ade80", cursor: "pointer",
            display: "none",
          }}
        >
          {isOpen
            ? <XMarkIcon style={{ width: 22, height: 22 }} />
            : <Bars3Icon style={{ width: 22, height: 22 }} />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: "hidden",
              background: "rgba(4,22,10,0.98)",
              borderBottom: "1px solid rgba(34,197,94,0.18)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px", gap: 10 }}>
              {user ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    style={{ width: "100%", maxWidth: 300, padding: "11px 20px", borderRadius: 12, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{ width: "100%", maxWidth: 300, padding: "11px 20px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    style={{ width: "100%", maxWidth: 300, padding: "11px 20px", borderRadius: 12, background: "transparent", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    style={{ width: "100%", maxWidth: 300, padding: "11px 20px", borderRadius: 12, background: "linear-gradient(135deg, #14532d, #16a34a)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(22,163,74,0.25)" }}
                  >
                    Register
                  </button>
                </>
              )}
              <button
                onClick={() => { onAIOpen(); setIsOpen(false); }}
                style={{ width: "100%", maxWidth: 300, padding: "11px 20px", borderRadius: 12, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                🤖 AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;