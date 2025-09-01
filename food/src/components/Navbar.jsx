import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaUtensils } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center bg-white rounded-full p-2 shadow hover:scale-105 transition"
        >
          <FaUtensils className="text-3xl text-green-600 mr-2" />
          <h1 className="text-lg md:text-xl font-bold text-gray-800">FoodShare</h1>
        </Link>

        {/* Desktop Center Buttons */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-4">
          {user ? (
            <>
              <button
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg shadow hover:bg-green-50 transition"
                onClick={handleDashboardClick}
              >
                Dashboard
              </button>
              <button
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg shadow hover:bg-red-50 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg shadow hover:bg-green-50 transition"
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Right Side AI Button */}
        <div className="hidden md:flex ml-auto">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
            🤖 AI
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="flex flex-col items-center py-4 space-y-4">
              {user ? (
                <>
                  <button
                    className="px-3 py-1 border border-green-600 text-green-600 rounded-lg shadow hover:bg-green-50 transition"
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </button>
                  <button
                    className="px-3 py-1 border border-red-600 text-red-600 rounded-lg shadow hover:bg-red-50 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-3 py-1 border border-green-600 text-green-600 rounded-lg shadow hover:bg-green-50 transition"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </button>
                </>
              )}

              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                onClick={() => setIsOpen(false)}
              >
                🤖 AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;


