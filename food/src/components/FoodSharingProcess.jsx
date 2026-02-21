import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDonate, FaCheckCircle, FaTruck, FaHandsHelping, FaChartLine, FaHeart } from 'react-icons/fa';
import { Link } from "react-router-dom";

const FoodSharingProcess = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Food Donation",
      description: "Restaurants, hotels, and individuals list their surplus food through our platform with just a few clicks.",
      image: "1.jpg",
      icon: <FaDonate className="text-xl" />,
      accent: "#fbbf24",
      accentDark: "#d97706",
      label: "Step 01",
    },
    {
      id: 2,
      title: "Quality Check",
      description: "Our expert team verifies food quality and ensures it meets the highest safety standards before distribution.",
      image: "2.jpg",
      icon: <FaCheckCircle className="text-xl" />,
      accent: "#34d399",
      accentDark: "#059669",
      label: "Step 02",
    },
    {
      id: 3,
      title: "Matching & Dispatch",
      description: "Smart algorithms match donations with nearby NGOs and arrange for prompt pickup or delivery.",
      image: "3.avif",
      icon: <FaTruck className="text-xl" />,
      accent: "#38bdf8",
      accentDark: "#0284c7",
      label: "Step 03",
    },
    {
      id: 4,
      title: "Distribution",
      description: "Food reaches those in need through our extensive network of trusted partner NGOs and volunteers.",
      image: "4.jpeg",
      icon: <FaHandsHelping className="text-xl" />,
      accent: "#c084fc",
      accentDark: "#9333ea",
      label: "Step 04",
    },
    {
      id: 5,
      title: "Impact Tracking",
      description: "Donors receive detailed reports and real-time updates on how their contribution made a meaningful difference.",
      image: "5.jpeg",
      icon: <FaChartLine className="text-xl" />,
      accent: "#fb7185",
      accentDark: "#e11d48",
      label: "Step 05",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Meals Daily", icon: "🍽️", accent: "#fbbf24" },
    { value: "50+",     label: "Cities",      icon: "🏙️", accent: "#38bdf8" },
    { value: "1,200+",  label: "NGOs",        icon: "🤝", accent: "#c084fc" },
    { value: "95%",     label: "Safety",      icon: "⭐", accent: "#34d399" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .fsp-section {
          font-family: 'DM Sans', sans-serif;
          background: #080f0f;
          position: relative;
          overflow: hidden;
        }

        /* ── Grid Lines ── */
        .fsp-grid-v { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.025); }
        .fsp-grid-h { position: absolute; left: 0; right: 0; height: 1px; background: rgba(255,255,255,0.025); }

        /* ── Timeline Line ── */
        .timeline-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #fbbf24, #34d399, #38bdf8, #c084fc, #fb7185);
          opacity: 0.25;
          border-radius: 2px;
        }
        .timeline-line::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0; bottom: 0;
          width: 6px;
          background: inherit;
          filter: blur(6px);
          opacity: 0.4;
        }

        /* ── Step Row ── */
        .step-row { position: relative; display: flex; align-items: center; gap: 60px; }
        .step-row.reverse { flex-direction: row-reverse; }

        /* ── Image Frame ── */
        .img-frame {
          position: relative;
          border-radius: 28px;
          overflow: visible;
          flex-shrink: 0;
          width: 42%;
        }
        .img-frame img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 24px;
          display: block;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .img-frame:hover img { transform: scale(1.04); }
        .img-overlay {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%);
          pointer-events: none;
        }
        .img-border-glow {
          position: absolute;
          inset: -1px;
          border-radius: 25px;
          border: 1px solid transparent;
          background: linear-gradient(135deg, var(--accent), transparent 60%) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .img-frame:hover .img-border-glow { opacity: 1; }
        .img-outer-glow {
          position: absolute;
          inset: -20px;
          border-radius: 40px;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, var(--accent-faint) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s;
          z-index: -1;
        }
        .img-frame:hover .img-outer-glow { opacity: 1; }

        /* Step badge */
        .step-badge {
          position: absolute;
          top: -14px; left: -14px;
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 18px;
          color: #000;
          z-index: 2;
          box-shadow: 0 4px 20px var(--accent-faint);
        }
        .icon-badge {
          position: absolute;
          bottom: -14px; right: -14px;
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          z-index: 2;
          box-shadow: 0 4px 20px var(--accent-faint);
          backdrop-filter: blur(8px);
        }

        /* ── Content Card ── */
        .content-card {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.35s, box-shadow 0.35s;
        }
        .content-card:hover {
          border-color: var(--accent-mid);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .content-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 0% 0%, var(--accent-faint) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .content-card:hover::before { opacity: 1; }
        .ghost-number {
          position: absolute;
          bottom: -16px; right: 16px;
          font-family: 'Playfair Display', serif;
          font-size: 96px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, var(--accent), transparent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.08;
          user-select: none;
          pointer-events: none;
        }

        /* Progress dots */
        .prog-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .prog-dot.active { transform: scale(1.3); }

        /* ── Timeline Node ── */
        .timeline-node {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        .timeline-node-inner {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 3px solid var(--accent);
          background: #080f0f;
          box-shadow: 0 0 12px var(--accent);
        }
        .timeline-node-inner::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          opacity: 0.3;
        }

        /* ── Stat Card ── */
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          border-color: var(--accent-mid);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 10%; right: 10%;
          height: 2px;
          border-radius: 2px 2px 0 0;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.5;
        }

        /* ── CTA Block ── */
        .cta-block {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          padding: 56px 48px;
          text-align: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(52,211,153,0.2);
        }
        .cta-block::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(52,211,153,0.1) 0%, transparent 70%);
          pointer-events: none;
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
          backdrop-filter: blur(8px);
        }

        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float-med  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .anim-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .anim-float-med  { animation: float-med  5s ease-in-out infinite; }
      `}</style>

      <section className="fsp-section py-24 lg:py-32" id="food-sharing-process">

        {/* Grid decoration */}
        {[18,36,54,72].map(l => <div key={l} className="fsp-grid-v" style={{left:`${l}%`}} />)}
        {[25,50,75].map(t => <div key={t} className="fsp-grid-h" style={{top:`${t}%`}} />)}

        {/* Ambient blobs */}
        <div style={{position:'absolute',top:'-80px',left:'-80px',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(251,191,36,0.06) 0%,transparent 70%)',filter:'blur(40px)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:'-60px',right:'-60px',width:'450px',height:'450px',borderRadius:'50%',background:'radial-gradient(circle,rgba(52,211,153,0.07) 0%,transparent 70%)',filter:'blur(40px)',pointerEvents:'none'}} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* ── Header ── */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex justify-center mb-6">
              <div className="tag-pill">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Our Process
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                width:72, height:72,
                borderRadius:20,
                background:'linear-gradient(135deg,#4ade80,#059669)',
                display:'flex', alignItems:'center', justifyContent:'center',
                margin:'0 auto 24px',
                boxShadow:'0 0 40px rgba(52,211,153,0.3)',
              }}
            >
              <FaHeart style={{fontSize:28,color:'#fff'}} />
            </motion.div>

            <h2 style={{
              fontFamily:"'Playfair Display',serif",
              fontWeight:900,
              fontSize:'clamp(36px,5.5vw,68px)',
              lineHeight:1.1,
              letterSpacing:'-0.02em',
              color:'#fff',
              marginBottom:16,
            }}>
              The{' '}
              <span style={{
                background:'linear-gradient(135deg,#86efac,#34d399,#059669)',
                WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent',
              }}>
                Beautiful Journey
              </span>
              {' '}of Food Sharing
            </h2>
            <p style={{color:'rgba(255,255,255,0.45)',maxWidth:540,margin:'0 auto',fontSize:17,fontWeight:300,lineHeight:1.8}}>
              Witness how surplus food transforms into hope and nourishment for communities in need
            </p>
          </motion.div>

          {/* ── Steps ── */}
          <div className="relative">
            {/* Center timeline line (desktop) */}
            {!isMobile && <div className="hidden lg:block timeline-line" />}

            <div style={{ display:'flex', flexDirection:'column', gap: isMobile ? 48 : 80 }}>
              {steps.map((step, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22,1,0.36,1] }}
                    viewport={{ once: true, margin: "-80px" }}
                    style={{ position: 'relative' }}
                  >
                    {/* Timeline node (desktop) */}
                    {!isMobile && (
                      <div
                        className="timeline-node hidden lg:block"
                        style={{ '--accent': step.accent, top: '50%' }}
                      >
                        <div className="timeline-node-inner" style={{ position:'relative' }} />
                      </div>
                    )}

                    <div
                      className={`flex flex-col lg:items-center lg:gap-16 ${!isMobile ? (isEven ? 'lg:flex-row' : 'lg:flex-row-reverse') : ''}`}
                      style={{ gap: isMobile ? 24 : undefined }}
                    >
                      {/* Image */}
                      <div
                        className="img-frame"
                        style={{
                          '--accent': step.accent,
                          '--accent-faint': `${step.accent}18`,
                          width: isMobile ? '100%' : '42%',
                        }}
                      >
                        <div className="img-outer-glow" />
                        <div className="img-border-glow" />

                        {/* Step badge */}
                        <div
                          className="step-badge"
                          style={{ background: `linear-gradient(135deg, ${step.accent}, ${step.accentDark})`, '--accent-faint': `${step.accent}40` }}
                        >
                          {step.id}
                        </div>

                        <img src={step.image} alt={step.title} style={{ overflow:'hidden' }} />
                        <div className="img-overlay" />

                        {/* Icon badge */}
                        <div
                          className="icon-badge"
                          style={{ background: `linear-gradient(135deg, ${step.accent}cc, ${step.accentDark}cc)`, '--accent-faint': `${step.accent}40`, border: `1px solid ${step.accent}50` }}
                        >
                          {step.icon}
                        </div>
                      </div>

                      {/* Content card */}
                      <div
                        className="content-card"
                        style={{
                          '--accent': step.accent,
                          '--accent-mid': `${step.accent}55`,
                          '--accent-faint': `${step.accent}12`,
                          flex: 1,
                        }}
                      >
                        <span className="ghost-number">{String(step.id).padStart(2,'0')}</span>

                        <span style={{
                          fontSize:11,
                          fontWeight:700,
                          letterSpacing:'0.12em',
                          textTransform:'uppercase',
                          color: step.accent,
                          display:'block',
                          marginBottom:12,
                        }}>
                          {step.label}
                        </span>

                        <h3 style={{
                          fontFamily:"'Playfair Display',serif",
                          fontWeight:700,
                          fontSize:24,
                          color:'#fff',
                          marginBottom:12,
                          lineHeight:1.25,
                        }}>
                          {step.title}
                        </h3>

                        <p style={{
                          color:'rgba(255,255,255,0.5)',
                          fontSize:15,
                          lineHeight:1.8,
                          marginBottom:24,
                          fontWeight:300,
                        }}>
                          {step.description}
                        </p>

                        {/* Progress dots */}
                        <div style={{ display:'flex', gap:8 }}>
                          {[...Array(5)].map((_,di) => (
                            <div
                              key={di}
                              className={`prog-dot ${di < step.id ? 'active' : ''}`}
                              style={{
                                background: di < step.id ? step.accent : 'rgba(255,255,255,0.12)',
                                boxShadow: di < step.id ? `0 0 8px ${step.accent}80` : 'none',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Stats ── */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-20 lg:mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card"
                style={{ '--accent': stat.accent, '--accent-mid': `${stat.accent}55` }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{
                  width:56, height:56,
                  borderRadius:16,
                  background:`linear-gradient(135deg,${stat.accent}22,${stat.accent}08)`,
                  border:`1px solid ${stat.accent}33`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:24,
                  margin:'0 auto 16px',
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontFamily:"'Playfair Display',serif",
                  fontWeight:900,
                  fontSize:28,
                  color:'#fff',
                  marginBottom:4,
                  background:`linear-gradient(135deg,${stat.accent},#fff)`,
                  WebkitBackgroundClip:'text',
                  WebkitTextFillColor:'transparent',
                }}>
                  {stat.value}
                </div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:13, fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            className="cta-block mt-20 lg:mt-28"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* decorative corner blobs */}
            <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(52,211,153,0.12) 0%,transparent 70%)',pointerEvents:'none'}} />
            <div style={{position:'absolute',bottom:-40,left:-40,width:180,height:180,borderRadius:'50%',background:'radial-gradient(circle,rgba(134,239,172,0.08) 0%,transparent 70%)',pointerEvents:'none'}} />

            <motion.div
              className="anim-float-slow"
              style={{display:'inline-block',marginBottom:20}}
            >
              <div style={{
                width:64,height:64,
                borderRadius:18,
                background:'linear-gradient(135deg,#4ade80,#059669)',
                display:'flex',alignItems:'center',justifyContent:'center',
                margin:'0 auto',
                boxShadow:'0 0 32px rgba(52,211,153,0.4)',
              }}>
                <FaHeart style={{fontSize:24,color:'#fff'}} />
              </div>
            </motion.div>

            <h3 style={{
              fontFamily:"'Playfair Display',serif",
              fontWeight:900,
              fontSize:'clamp(26px,4vw,42px)',
              color:'#fff',
              marginBottom:12,
              letterSpacing:'-0.01em',
            }}>
              Ready to Create Change?
            </h3>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:17, fontWeight:300, marginBottom:36, maxWidth:500, margin:'0 auto 36px' }}>
              Join our movement and be part of the solution to hunger and food waste
            </p>

            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'14px 32px',
                    borderRadius:999,
                    border:'none',
                    cursor:'pointer',
                    fontSize:15, fontWeight:600,
                    fontFamily:"'DM Sans',sans-serif",
                    color:'#000',
                    background:'linear-gradient(135deg,#86efac,#34d399)',
                    boxShadow:'0 0 32px rgba(52,211,153,0.35), 0 8px 24px rgba(0,0,0,0.2)',
                  }}
                >
                  <FaDonate /> Donate Food Now
                </motion.button>
              </Link>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding:'14px 32px',
                    borderRadius:999,
                    cursor:'pointer',
                    fontSize:15, fontWeight:600,
                    fontFamily:"'DM Sans',sans-serif",
                    color:'#fff',
                    background:'rgba(255,255,255,0.06)',
                    border:'1px solid rgba(255,255,255,0.18)',
                    backdropFilter:'blur(12px)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor='rgba(134,239,172,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
                >
                  Become a Volunteer
                </motion.button>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default FoodSharingProcess;