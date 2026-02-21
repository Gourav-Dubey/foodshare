import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Floating Particle ────────────────────────────────────────────────────────
const Particle = ({ delay, x, size, duration }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      bottom: "-20px",
      width: size,
      height: size,
      background: "radial-gradient(circle, rgba(134,239,172,0.6), rgba(52,211,153,0.1))",
      filter: "blur(1px)",
    }}
    animate={{
      y: [0, -window.innerHeight - 60],
      opacity: [0, 0.7, 0.7, 0],
      scale: [0.8, 1.2, 0.9],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// ─── Stat Badge ────────────────────────────────────────────────────────────────
const StatBadge = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center"
  >
    <span
      className="text-3xl md:text-4xl font-black tracking-tight"
      style={{
        background: "linear-gradient(135deg, #86efac, #34d399)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {value}
    </span>
    <span className="text-xs md:text-sm text-white/50 mt-1 uppercase tracking-widest font-medium">
      {label}
    </span>
  </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const FoodShareHero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const backgrounds = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80",
  ];

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: `${Math.random() * 8 + 3}px`,
    delay: Math.random() * 8,
    duration: Math.random() * 8 + 6,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  useEffect(() => {
    const handleMouse = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

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
    <>
      {/* Google Fonts */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap");

        .btn-primary {
          position: relative;
          overflow: hidden;
          font-family: "DM Sans", sans-serif;
          letter-spacing: 0.03em;
        }
        .btn-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #4ade80, #059669, #34d399);
          background-size: 200% 200%;
          animation: shimmer 3s ease infinite;
          z-index: 0;
        }
        .btn-primary:hover::after {
          content: "";
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #86efac, #6ee7b7, #34d399);
          border-radius: inherit;
          z-index: -1;
          filter: blur(12px);
          opacity: 0.6;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
          pointer-events: none;
          z-index: 5;
        }
        .dot-indicator {
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .glow-line {
          background: linear-gradient(90deg, transparent, rgba(134,239,172,0.6), transparent);
        }
        /* ── MOBILE FIX ── */
        @media (max-width: 768px) {
          .hero-content-wrap {
            padding-top: 72px !important;
          }
          .hero-stat-row {
            gap: 16px !important;
          }
          .hero-stat-divider {
            display: none !important;
          }
        }
      `}</style>

      <div ref={heroRef} className="relative h-screen w-full overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Background Images ── */}
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            animate={{
              opacity: index === currentBg ? 1 : 0,
              scale: index === currentBg ? 1.04 : 1,
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        ))}

        {/* ── Layered Overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-emerald-950/70 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-[2]" />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(4,120,87,0.15) 100%)",
          }}
        />
        <div className="noise-overlay" />

        {/* ── Parallax light orb following cursor ── */}
        <motion.div
          className="absolute rounded-full pointer-events-none z-[3]"
          style={{
            width: "600px",
            height: "600px",
            left: "50%",
            top: "50%",
            background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{
            x: mousePos.x * 80 - 300,
            y: mousePos.y * 80 - 300,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        />

        {/* ── Floating Particles ── */}
        <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}
        </div>

        {/* ── Decorative horizontal glow line ── */}
        <motion.div
          className="absolute left-0 right-0 h-px glow-line z-[4]"
          style={{ top: "72%" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />

        {/* ── Main Content ── */}
        <div className="hero-content-wrap relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-5xl w-full"
          >

            {/* Pill tag */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  color: "#86efac",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Together Against Hunger
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 leading-none"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
            >
              <span
                className="block text-5xl md:text-7xl lg:text-8xl text-white mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                Share Food.
              </span>
              <span
                className="block text-5xl md:text-7xl lg:text-8xl"
                style={{
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #86efac 0%, #34d399 45%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 40px rgba(52,211,153,0.3))",
                }}
              >
                Save Lives.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="mx-auto mb-10 max-w-xl text-lg md:text-xl"
              style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontWeight: 300 }}
            >
              Join our mission to reduce food waste and fight hunger in your community.{" "}
              <em style={{ color: "rgba(134,239,172,0.9)", fontStyle: "normal", fontWeight: 500 }}>Every meal matters.</em>
            </motion.p>

            {/* Buttons */}
            {!user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-5 mb-10"
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDonateClick}
                  className="btn-primary rounded-full px-10 py-4 text-base font-semibold text-white"
                  style={{ boxShadow: "0 0 40px rgba(52,211,153,0.35), 0 8px 32px rgba(0,0,0,0.3)" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Donate Food
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleVolunteerClick}
                  className="rounded-full px-10 py-4 text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.borderColor = "rgba(134,239,172,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                >
                  Become Volunteer
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                className="mb-10"
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(user.role === "donor" ? "/donor-dashboard" : "/ngo-dashboard")}
                  className="btn-primary rounded-full px-12 py-4 text-base font-semibold text-white"
                  style={{ boxShadow: "0 0 40px rgba(52,211,153,0.35), 0 8px 32px rgba(0,0,0,0.3)" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Go to Dashboard
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* ── Stats Row ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="hero-stat-row flex items-center justify-center gap-8 md:gap-16"
            >
              <div className="hero-stat-divider hidden sm:block h-10 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <StatBadge value="2M+" label="Meals Shared" delay={1.0} />
              <div className="hero-stat-divider h-10 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <StatBadge value="500+" label="NGO Partners" delay={1.1} />
              <div className="hero-stat-divider h-10 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <StatBadge value="50K+" label="Volunteers" delay={1.2} />
              <div className="hero-stat-divider hidden sm:block h-10 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Slide Indicators ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20"
        >
          {backgrounds.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBg(i)}
              className="dot-indicator rounded-full cursor-pointer border-0"
              style={{
                width: i === currentBg ? "28px" : "8px",
                height: "8px",
                background: i === currentBg
                  ? "linear-gradient(90deg, #4ade80, #34d399)"
                  : "rgba(255,255,255,0.3)",
                boxShadow: i === currentBg ? "0 0 10px rgba(52,211,153,0.5)" : "none",
              }}
            />
          ))}
        </motion.div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-1.5"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <span className="text-xs uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </>
  );
};

export default FoodShareHero;