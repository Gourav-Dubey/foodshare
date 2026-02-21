import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaUtensils,
  FaBars,
  FaTimes,
  FaRobot,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const FoodShareSideDock = ({ onAIOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredButton, setHoveredButton] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDockOpen, setIsDockOpen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const buttons = [
    { id: "/", label: "Home", icon: <FaHome className="text-lg" /> },
    { id: "/about", label: "About", icon: <FaInfoCircle className="text-lg" /> },
    { id: "ai", label: "AI", icon: <FaRobot className="text-lg" /> },
    { id: "/contact", label: "Contact", icon: <FaPhone className="text-lg" /> },
  ];

  const handleButtonClick = useCallback(
    (path) => {
      if (path === "ai") {
        onAIOpen();
        if (isMobile) setMobileMenuOpen(false);
        return;
      }
      navigate(path);
      if (isMobile) setMobileMenuOpen(false);
    },
    [navigate, isMobile, onAIOpen]
  );

  // =========================
  // DESKTOP VERSION
  // =========================
  if (!isMobile) {
    return (
      <>
        {/* Toggle Button */}
        <motion.button
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            margin: "auto 0",
            height: "fit-content",
            zIndex: 50,
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            color: "#fff",
            padding: "8px 5px",
            borderRadius: "0 10px 10px 0",
            border: "none",
            cursor: "pointer",
            boxShadow: "2px 0 12px rgba(22,163,74,0.3)",
          }}
          onClick={() => setIsDockOpen(!isDockOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isDockOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
        </motion.button>

        <AnimatePresence>
          {isDockOpen && (
            <motion.div
              style={{
                position: "fixed",
                left: 16,
                top: 0,
                bottom: 0,
                margin: "auto 0",
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(5, 18, 11, 0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: 20,
                padding: "14px 10px",
                border: "1px solid rgba(34,197,94,0.15)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08) inset",
                zIndex: 40,
              }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* Logo */}
              <div style={{ marginBottom: 14, padding: "6px 0" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "linear-gradient(135deg, #14532d, #16a34a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(22,163,74,0.35)",
                  border: "1px solid rgba(74,222,128,0.2)",
                }}>
                  <FaUtensils style={{ color: "#fff", fontSize: 16 }} />
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 32, height: 1, background: "rgba(34,197,94,0.15)", marginBottom: 10 }} />

              {/* Buttons */}
              {buttons.map((button) => {
                const isActive = location.pathname === button.id;
                const isHovered = hoveredButton === button.id;
                return (
                  <motion.button
                    key={button.id}
                    onMouseEnter={() => setHoveredButton(button.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => handleButtonClick(button.id)}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      width: 44, height: 44,
                      margin: "5px 0",
                      borderRadius: 13,
                      border: isActive
                        ? "1px solid rgba(74,222,128,0.35)"
                        : isHovered
                        ? "1px solid rgba(34,197,94,0.2)"
                        : "1px solid transparent",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(22,163,74,0.3), rgba(20,83,45,0.4))"
                        : isHovered
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(255,255,255,0.03)",
                      color: isActive ? "#4ade80" : isHovered ? "#86efac" : "rgba(167,243,208,0.45)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16,
                      boxShadow: isActive ? "0 0 14px rgba(74,222,128,0.15)" : "none",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    {button.icon}
                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        style={{
                          position: "absolute",
                          right: -2, top: "50%",
                          transform: "translateY(-50%)",
                          width: 4, height: 4,
                          borderRadius: "50%",
                          background: "#4ade80",
                          boxShadow: "0 0 6px #4ade80",
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // =========================
  // MOBILE VERSION
  // =========================
  return (
    <>
      {/* Floating Button */}
      <motion.button
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          color: "#fff", border: "1px solid rgba(74,222,128,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 24px rgba(22,163,74,0.4)",
          cursor: "pointer", zIndex: 50,
          fontSize: 20,
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 40,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "rgba(5,18,11,0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "24px 24px 0 0",
                border: "1px solid rgba(34,197,94,0.15)",
                borderBottom: "none",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
                zIndex: 50, padding: "20px 16px 32px",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Handle */}
              <div style={{
                width: 40, height: 4, borderRadius: 2,
                background: "rgba(34,197,94,0.2)",
                margin: "0 auto 16px",
              }} />

              {/* Brand */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg, #14532d, #16a34a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                  border: "1px solid rgba(74,222,128,0.2)",
                }}>
                  <FaUtensils style={{ color: "#fff", fontSize: 15 }} />
                </div>
                <span style={{ marginLeft: 8, fontWeight: 600, color: "#ecfdf5", fontSize: 16 }}>FoodShare</span>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(34,197,94,0.1)", marginBottom: 16 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {buttons.map((button) => {
                  const isActive = location.pathname === button.id;
                  return (
                    <motion.button
                      key={button.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleButtonClick(button.id)}
                      style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        padding: "14px 10px",
                        borderRadius: 14,
                        border: isActive
                          ? "1px solid rgba(74,222,128,0.3)"
                          : "1px solid rgba(34,197,94,0.08)",
                        background: isActive
                          ? "linear-gradient(135deg, rgba(22,163,74,0.25), rgba(20,83,45,0.35))"
                          : "rgba(255,255,255,0.03)",
                        color: isActive ? "#4ade80" : "rgba(167,243,208,0.5)",
                        cursor: "pointer",
                        boxShadow: isActive ? "0 0 16px rgba(74,222,128,0.1)" : "none",
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{button.icon}</div>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{button.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(FoodShareSideDock);