import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaLeaf, FaHandshake, FaChartLine, FaArrowDown } from "react-icons/fa";

const steps = [
  {
    title: "List Your Surplus Food",
    desc: "Snap a photo of your excess food, add details like quantity and preparation time, and set your location. Our app makes it quick and simple—just a few taps to make a difference.",
    icon: <FaLeaf className="text-2xl" />,
    details: "Whether it's leftover catering, extra restaurant meals, or unused groceries, you can easily share what you have with those in need.",
    color: "from-emerald-400 to-green-600",
    accent: "#34d399",
    accentDark: "#059669",
    label: "Step 01",
  },
  {
    title: "Connect With Local NGOs",
    desc: "Our system automatically matches your donation with verified NGOs and volunteers in your area. See their ratings and choose who you'd like to help with your contribution.",
    icon: <FaHandshake className="text-2xl" />,
    details: "We partner with trusted organizations that follow strict food safety protocols to ensure your donation reaches people safely and respectfully.",
    color: "from-sky-400 to-blue-600",
    accent: "#38bdf8",
    accentDark: "#0284c7",
    label: "Step 02",
  },
  {
    title: "Schedule Pickup & Track Impact",
    desc: "Coordinate a convenient pickup time and receive notifications throughout the process. Plus, get updates on how your donation helped feed people in your community.",
    icon: <FaChartLine className="text-2xl" />,
    details: "Every donation creates a ripple effect. Track your personal impact through our dashboard that shows meals shared and carbon footprint reduced.",
    color: "from-violet-400 to-purple-600",
    accent: "#a78bfa",
    accentDark: "#7c3aed",
    label: "Step 03",
  },
];

const HowItWorks = () => {
  const [expandedStep, setExpandedStep] = useState(null);
  const headingRef = useRef(null);
  const stepRefs = [useRef(null), useRef(null), useRef(null)];

  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });
  const stepsInView = stepRefs.map((ref) => useInView(ref, { once: true, amount: 0.3 }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hiw-section {
          font-family: 'DM Sans', sans-serif;
          background: #080f0f;
          position: relative;
          overflow: hidden;
        }

        .step-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 40px 32px 32px;
          height: 100%;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(12px);
          transition: border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
          cursor: default;
          overflow: hidden;
        }
        .step-card:hover {
          border-color: var(--accent);
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px var(--accent), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .step-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: radial-gradient(ellipse 60% 40% at 50% 0%, var(--accent-faint) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .step-card:hover::before { opacity: 1; }

        .icon-ring {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 24px;
        }
        .icon-ring::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 21px;
          background: linear-gradient(135deg, var(--accent), transparent);
          z-index: -1;
        }

        .connector-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
        }
        .connector-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          opacity: 0.5;
          animation: pulse-ring 2s ease infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 0; }
        }

        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 72px;
          font-weight: 900;
          line-height: 1;
          position: absolute;
          top: -8px;
          right: 24px;
          background: linear-gradient(135deg, var(--accent), transparent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.12;
          pointer-events: none;
          user-select: none;
        }

        .learn-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--accent);
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s;
        }
        .learn-btn:hover { opacity: 0.75; }

        .details-box {
          margin-top: 16px;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.65;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          overflow: hidden;
        }

        .grid-line {
          position: absolute;
          background: rgba(255,255,255,0.025);
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(52,211,153,0.3);
          background: rgba(52,211,153,0.08);
          color: #86efac;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 20px;
          backdrop-filter: blur(8px);
        }
      `}</style>

      <section className="hiw-section py-28" id="how-it-works">

        {/* Grid decoration lines */}
        {[15, 35, 55, 75].map((left) => (
          <div key={left} className="grid-line" style={{ left: `${left}%`, top: 0, bottom: 0, width: "1px" }} />
        ))}
        {[20, 50, 80].map((top) => (
          <div key={top} className="grid-line" style={{ top: `${top}%`, left: 0, right: 0, height: "1px" }} />
        ))}

        {/* Big ambient blobs */}
        <div style={{
          position: "absolute", top: "-100px", left: "-100px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", right: "-80px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none"
        }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* ── Heading ── */}
          <motion.div
            ref={headingRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <div className="tag-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Simple Process
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(40px, 6vw, 72px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#fff",
                marginBottom: "20px",
              }}
            >
              How{" "}
              <span style={{
                background: "linear-gradient(135deg, #86efac, #34d399, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                It Works
              </span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75, fontSize: "17px", fontWeight: 300 }}>
              Turning your surplus food into meals for those in need is simple, safe, and rewarding.
            </p>
          </motion.div>

          {/* ── Connector Row (desktop) ── */}
          <div className="hidden md:flex items-center justify-between mb-12 px-8">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={headingInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                  className="connector-dot"
                  style={{ "--accent": step.accent, background: step.accent }}
                />
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={headingInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.15, duration: 0.6, ease: "easeOut" }}
                    style={{
                      flex: 1,
                      height: "1px",
                      background: `linear-gradient(90deg, ${steps[i].accent}, ${steps[i + 1].accent})`,
                      opacity: 0.3,
                      transformOrigin: "left",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── Step Cards ── */}
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                ref={stepRefs[i]}
                initial={{ opacity: 0, y: 40 }}
                animate={stepsInView[i] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ "--accent": step.accent, "--accent-faint": `${step.accent}18` }}
              >
                <div className="step-card">
                  {/* Ghost big number */}
                  <span className="step-number">{String(i + 1).padStart(2, "0")}</span>

                  {/* Label */}
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: step.accent,
                    textTransform: "uppercase",
                    marginBottom: "16px",
                    display: "block",
                  }}>
                    {step.label}
                  </span>

                  {/* Icon */}
                  <div
                    className="icon-ring"
                    style={{
                      background: `linear-gradient(135deg, ${step.accent}22, ${step.accent}08)`,
                      border: `1px solid ${step.accent}33`,
                      color: step.accent,
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "12px",
                    lineHeight: 1.25,
                  }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "14px",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                    flexGrow: 1,
                    fontWeight: 300,
                  }}>
                    {step.desc}
                  </p>

                  {/* Learn more */}
                  <button
                    className="learn-btn"
                    onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                  >
                    {expandedStep === i ? "Show less" : "Learn more"}
                    <motion.span animate={{ rotate: expandedStep === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <FaArrowDown size={10} />
                    </motion.span>
                  </button>

                  {/* Expanded */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedStep === i ? "auto" : 0, opacity: expandedStep === i ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="details-box">{step.details}</div>
                  </motion.div>

                  {/* Bottom accent bar */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: "10%",
                    right: "10%",
                    height: "2px",
                    borderRadius: "2px 2px 0 0",
                    background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
                    opacity: 0.6,
                  }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Bottom CTA strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{
              marginTop: "60px",
              padding: "28px 40px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: "17px", marginBottom: "4px" }}>
                Ready to make a difference?
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 300 }}>
                Join thousands of donors already fighting hunger.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 32px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.03em",
                background: "linear-gradient(135deg, #4ade80, #059669)",
                boxShadow: "0 0 32px rgba(52,211,153,0.35), 0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              Start Donating →
            </motion.button>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default HowItWorks;