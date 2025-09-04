 import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaInfoCircle, FaPhone, FaUtensils, FaBars, FaTimes, FaRobot, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FoodShareSideDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDockOpen, setIsDockOpen] = useState(true); // 👈 dock toggle state

  // Check screen size and update isMobile state
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
    { id: "/ai", label: "AI", icon: <FaRobot className="text-lg" /> },
    { id: "/contact", label: "Contact", icon: <FaPhone className="text-lg" /> },
  ];

  // Memoized click handler
  const handleButtonClick = useCallback(
    (path) => {
      navigate(path);
      if (isMobile) setMobileMenuOpen(false);
    },
    [navigate, isMobile]
  );

  // Hover handlers
  const handleHoverStart = useCallback(
    (id) => {
      if (!isMobile) setHoveredButton(id);
    },
    [isMobile]
  );
  const handleHoverEnd = useCallback(() => {
    if (!isMobile) setHoveredButton(null);
  }, [isMobile]);

  // Desktop Side Dock
  if (!isMobile) {
    return (
      <>
        {/* Toggle button (left edge) */}
        <motion.button
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-green-600 text-white p-2 rounded-r-xl shadow-md hover:bg-green-700"
          onClick={() => setIsDockOpen(!isDockOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isDockOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </motion.button>

        {/* Side Dock */}
        <AnimatePresence>
          {isDockOpen && (
            <motion.div
              className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl p-3 border border-green-200/50 shadow-xl z-40"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Logo */}
              <motion.div
                className="flex justify-center mb-4 p-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <FaUtensils className="text-lg text-white" />
                </div>
              </motion.div>

              {/* Buttons */}
              {buttons.map((button) => {
                const isActive = location.pathname === button.id;
                return (
                  <motion.div
                    key={button.id}
                    className="relative my-2"
                    onHoverStart={() => handleHoverStart(button.id)}
                    onHoverEnd={handleHoverEnd}
                    animate={{ scale: hoveredButton === button.id ? 1.1 : 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      mass: 0.5,
                    }}
                  >
                    <motion.button
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-200 ${
                        isActive
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      onClick={() => handleButtonClick(button.id)}
                    >
                      {button.icon}
                    </motion.button>

                    {/* Tooltip */}
                    {hoveredButton === button.id && (
                      <motion.div
                        className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-green-800 text-white text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {button.label}
                        <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-green-800 rotate-45"></div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Mobile bottom nav (same as before)
  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg z-50"
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </motion.button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
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
                <span className="ml-2 font-semibold text-green-800">FoodShare</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {buttons.map((button) => {
                  const isActive = location.pathname === button.id;
                  return (
                    <motion.button
                      key={button.id}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors duration-200 ${
                        isActive
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                          : "bg-green-50 text-green-700"
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleButtonClick(button.id)}
                    >
                      <div className="text-xl mb-1">{button.icon}</div>
                      <span className="text-xs font-medium">{button.label}</span>
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
