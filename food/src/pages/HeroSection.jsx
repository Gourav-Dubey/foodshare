import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ useAuth hook use karo

const FoodShareHero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const { user } = useAuth(); // ✅ ab yaha se user milega
  const navigate = useNavigate();

  // Background images
  const backgrounds = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?...",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?...",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?...",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const handleDonateClick = () => {
    if (user) {
      if (user.role === "donor") navigate("/donor-dashboard");
      else navigate("/ngo-dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleVolunteerClick = () => {
    if (user) {
      navigate("/ngo-dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentBg ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 text-lg font-semibold text-green-300 md:text-xl"
          >
            Together Against Hunger
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl"
          >
            Share Food.
            <span className="block bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Save Lives.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mb-10 max-w-2xl text-xl text-gray-200 md:text-2xl"
          >
            Join our mission to reduce food waste and fight hunger in your community. Every meal matters.
          </motion.p>

          {/* Buttons → user ke hisaab se show karo */}
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6"
            >
              {/* Donate Food Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDonateClick}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-green-500/50"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Donate Food →
                </span>
              </motion.button>

              {/* Become Volunteer Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVolunteerClick}
                className="group rounded-full border-2 border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/20"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Become Volunteer →
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(user.role === "donor" ? "/donor-dashboard" : "/ngo-dashboard")
              }
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-green-500/50"
            >
              <span className="relative z-10 flex items-center justify-center">
                Go to Dashboard →
              </span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FoodShareHero;
