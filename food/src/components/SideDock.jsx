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

  // Detect screen size
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
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-green-600 text-white p-2 rounded-r-xl shadow-md hover:bg-green-700"
          onClick={() => setIsDockOpen(!isDockOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isDockOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </motion.button>

        <AnimatePresence>
          {isDockOpen && (
            <motion.div
              className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl p-3 border border-green-200/50 shadow-xl z-40"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-4 p-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <FaUtensils className="text-lg text-white" />
                </div>
              </div>

              {/* Buttons */}
              {buttons.map((button) => {
                const isActive = location.pathname === button.id;
                return (
                  <motion.button
                    key={button.id}
                    className={`w-12 h-12 my-2 rounded-xl flex items-center justify-center text-xl ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-700"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleButtonClick(button.id)}
                  >
                    {button.icon}
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
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg z-50"
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </motion.button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl z-50 p-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-center items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <FaUtensils className="text-lg text-white" />
                </div>
                <span className="ml-2 font-semibold text-green-800">
                  FoodShare
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {buttons.map((button) => {
                  const isActive = location.pathname === button.id;
                  return (
                    <motion.button
                      key={button.id}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                        isActive
                          ? "bg-green-600 text-white"
                          : "bg-green-50 text-green-700"
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleButtonClick(button.id)}
                    >
                      <div className="text-xl mb-1">{button.icon}</div>
                      <span className="text-xs font-medium">
                        {button.label}
                      </span>
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