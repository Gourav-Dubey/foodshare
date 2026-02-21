import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Heart, Globe, Utensils, Target, Clock, MapPin, Star, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const stats = [
  { label: "Meals Shared", value: "2.5M+", icon: <Utensils />, description: "Nutritious meals delivered to those in need" },
  { label: "Volunteers", value: "25,000+", icon: <Users />, description: "Dedicated individuals making a difference" },
  { label: "Cities Worldwide", value: "120+", icon: <MapPin />, description: "Across 6 continents" },
  { label: "NGO Partners", value: "850+", icon: <Globe />, description: "Trusted organizations in our network" },
];

const team = [
  { name: "Gourav Dubey", role: "Founder & Visionary", img: "6.jpg", bio: "Passionate about food justice and sustainability, Gourav is committed to creating a world where no one goes hungry.", social: { linkedin: "#", twitter: "#" } },
  { name: "Manish Tiwari", role: "Co-Founder & Operations Lead", img: "7.jpg", bio: "Manish ensures that our food sharing network runs smoothly and efficiently.", social: { linkedin: "#", twitter: "#" } },
  { name: "Mayank Tiwari", role: "Tech Innovator", img: "8.jpg", bio: "Software engineer passionate about using technology to solve real-world problems.", social: { linkedin: "#", twitter: "#" } },
  { name: "Rohit Thakur", role: "Community Manager", img: "9.jpg", bio: "Software Engineer and Social Worker.", social: { linkedin: "#", twitter: "#" } },
];

const timeline = [
  { year: "2025", event: "Concept Born", description: "Idea sparked after witnessing food waste at local events" },
  { year: "2025", event: "Pilot Launch", description: "First successful food sharing in Mumbai with 5 NGO partners" },
  { year: "2025", event: "Tech Platform", description: "Website launched to scale operations" },
  { year: "2025", event: "National Expansion", description: "Expanded to 15 cities across India" },
  { year: "2025", event: "Global Reach", description: "Went international with operations in 6 countries" },
];

const values = [
  { title: "Compassion", icon: <Heart />, color: "#f87171", bg: "rgba(248,113,113,0.08)", description: "We lead with empathy in all our interactions, recognizing the dignity in every person we serve." },
  { title: "Innovation", icon: <Target />, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", description: "We continuously seek better solutions to complex problems of food distribution and waste reduction." },
  { title: "Sustainability", icon: <Globe />, color: "#4ade80", bg: "rgba(74,222,128,0.08)", description: "We build systems that create lasting change rather than temporary fixes." },
  { title: "Community", icon: <Users />, color: "#c084fc", bg: "rgba(192,132,252,0.08)", description: "We believe in the power of collective action and diverse partnerships." },
];

const testimonials = [
  { quote: "Food Share Network helped our shelter reduce food costs by 40% while providing more nutritious meals to our residents.", author: "Meera Singh", role: "Director, Hope Shelter", avatar: "https://i.pravatar.cc/100?img=11" },
  { quote: "As a restaurant owner, I used to feel guilty about food waste. Now I know exactly where my excess food is going and who it's helping.", author: "Rajiv Malhotra", role: "Owner, Spice Garden Restaurant", avatar: "https://i.pravatar.cc/100?img=12" },
  { quote: "Volunteering with Food Share Network has been the most rewarding experience. The app makes it so easy to coordinate pickups.", author: "Aisha Khan", role: "Volunteer for 2 years", avatar: "https://i.pravatar.cc/100?img=13" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true, margin: "-80px" },
});

const AboutUs = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextTestimonial = () => { setActiveTestimonial((prev) => (prev + 1) % testimonials.length); setIsPlaying(false); };
  const prevTestimonial = () => { setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length); setIsPlaying(false); };

  return (
    <div style={{ background: "#080f0b", color: "#e2f5ea", fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px", overflow: "hidden" }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "-5%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div style={{ position: "absolute", top: "30%", right: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)" }} />
        </div>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 28, fontSize: 13, color: "#4ade80", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block" }} />
            Our Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 800, lineHeight: 1.08, margin: "0 0 24px", letterSpacing: "-0.03em", color: "#f0fdf4" }}
          >
            About{" "}
            <span style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Food Share
            </span>
            <br />Network
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            style={{ fontSize: "1.15rem", color: "rgba(187,247,208,0.6)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.75 }}
          >
            We're building a global movement to eliminate food waste and hunger by connecting surplus food with people in need through technology and community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <Link
              to="/register"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", fontWeight: 600, padding: "14px 32px", borderRadius: 100, textDecoration: "none", fontSize: 15, boxShadow: "0 8px 32px rgba(22,163,74,0.35)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              Join Our Mission →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM (moved up) ── */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: 64 }} {...fadeUp()}>
          <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", fontWeight: 600 }}>The People Behind It</span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#f0fdf4", margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Meet Our Team</h2>
          <p style={{ color: "rgba(187,247,208,0.5)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto" }}>Diverse backgrounds, shared passion for making a difference</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {team.map((member, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              style={{ background: "rgba(5,18,11,0.8)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 20, padding: "32px 24px", textAlign: "center", backdropFilter: "blur(12px)", cursor: "default", position: "relative", overflow: "hidden" }}
            >
              {/* Glow on card */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)" }} />
              
              <div style={{ display: "inline-block", marginBottom: 20 }}>
                <img src={member.img} alt={member.name} style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(74,222,128,0.2)", display: "block" }} />
              </div>

              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f0fdf4", margin: "0 0 4px" }}>{member.name}</h3>
              <p style={{ fontSize: 13, color: "#4ade80", fontWeight: 500, margin: "0 0 12px" }}>{member.role}</p>
              <p style={{ fontSize: 13, color: "rgba(187,247,208,0.45)", lineHeight: 1.65, margin: "0 0 18px" }}>{member.bio}</p>

            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section style={{ padding: "80px 24px", background: "rgba(5,15,9,0.6)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          {[
            { icon: <Heart size={22} />, color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.15)", title: "Our Mission", body: "To create a world where no edible food goes to waste while people go hungry. We're building technology-powered solutions that make it simple and efficient to redirect surplus food to those who need it most.", quote: '"Every meal matters. Every action counts."', quoteColor: "#f87171" },
            { icon: <Globe size={22} />, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.15)", title: "Our Vision", body: "A future where food waste is eliminated, communities are nourished, and our food systems are sustainable and equitable. We envision a global network where sharing food is as natural as sharing a smile.", quote: '"Connecting compassion with technology to nourish communities."', quoteColor: "#60a5fa" },
          ].map((card, i) => (
            <motion.div key={i} {...fadeUp(i * 0.15)} style={{ background: "rgba(5,18,11,0.7)", border: `1px solid rgba(34,197,94,0.1)`, borderRadius: 20, padding: "36px 32px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${card.color}40, transparent)` }} />
              <div style={{ width: 48, height: 48, borderRadius: 14, background: card.bg, border: `1px solid ${card.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, marginBottom: 24 }}>
                {card.icon}
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f0fdf4", margin: "0 0 16px", letterSpacing: "-0.02em" }}>{card.title}</h2>
              <p style={{ color: "rgba(187,247,208,0.55)", lineHeight: 1.8, margin: "0 0 24px", fontSize: "0.95rem" }}>{card.body}</p>
              <div style={{ borderLeft: `3px solid ${card.color}`, paddingLeft: 16, color: card.quoteColor, fontStyle: "italic", fontSize: "0.9rem", opacity: 0.85 }}>{card.quote}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div style={{ textAlign: "center", marginBottom: 64 }} {...fadeUp()}>
            <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", fontWeight: 600 }}>By The Numbers</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#f0fdf4", margin: "12px 0", letterSpacing: "-0.02em" }}>Our Impact</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {stats.map((stat, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{ background: "rgba(5,18,11,0.8)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 18, padding: "32px 24px", textAlign: "center", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(74,222,128,0.06), transparent 60%)" }} />
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#4ade80" }}>
                  {React.cloneElement(stat.icon, { size: 22 })}
                </div>
                <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#4ade80", letterSpacing: "-0.03em", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f0fdf4", margin: "8px 0 6px" }}>{stat.label}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(187,247,208,0.4)", lineHeight: 1.5 }}>{stat.description}</div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} style={{ marginTop: 24, background: "rgba(5,18,11,0.8)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 18, padding: "28px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f0fdf4", margin: "0 0 8px" }}>Environmental Impact</h3>
              <p style={{ color: "rgba(187,247,208,0.5)", margin: 0, fontSize: "0.9rem", maxWidth: 500 }}>By reducing food waste, we've prevented approximately 8,500 tons of CO2 emissions — equivalent to taking 1,800 cars off the road for a year.</p>
            </div>
            <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "12px 24px", color: "#4ade80", fontWeight: 700, fontSize: "1.05rem", whiteSpace: "nowrap" }}>
              🌱 8,500+ Tons CO₂ Saved
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section style={{ padding: "100px 24px", background: "rgba(3,10,6,0.8)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div style={{ textAlign: "center", marginBottom: 72 }} {...fadeUp()}>
            <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", fontWeight: 600 }}>How We Got Here</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#f0fdf4", margin: "12px 0", letterSpacing: "-0.02em" }}>Our Journey</h2>
          </motion.div>

          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent, rgba(74,222,128,0.3) 10%, rgba(74,222,128,0.3) 90%, transparent)", transform: "translateX(-50%)" }} />

            {timeline.map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.12)}
                style={{ display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "center", marginBottom: 48, position: "relative" }}
              >
                <div style={{ width: "calc(50% - 40px)", padding: i % 2 === 0 ? "0 32px 0 0" : "0 0 0 32px" }}>
                  <div style={{ background: "rgba(5,18,11,0.9)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 16, padding: "20px 24px", backdropFilter: "blur(12px)", textAlign: i % 2 === 0 ? "right" : "left" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#4ade80", margin: "0 0 6px" }}>{item.event}</h3>
                    <p style={{ fontSize: "0.85rem", color: "rgba(187,247,208,0.5)", margin: 0, lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                </div>

                <div style={{ position: "relative", zIndex: 2, flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #14532d, #16a34a)", border: "3px solid #080f0b", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(74,222,128,0.25)" }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>{item.year}</span>
                </div>

                <div style={{ width: "calc(50% - 40px)" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div style={{ textAlign: "center", marginBottom: 64 }} {...fadeUp()}>
            <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", fontWeight: 600 }}>What Drives Us</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#f0fdf4", margin: "12px 0", letterSpacing: "-0.02em" }}>Our Values</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
            {values.map((value, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{ background: "rgba(5,18,11,0.8)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 20, padding: "32px 24px", textAlign: "center", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${value.color}50, transparent)` }} />
                <div style={{ width: 60, height: 60, borderRadius: 18, background: value.bg, border: `1px solid ${value.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: value.color }}>
                  {React.cloneElement(value.icon, { size: 24 })}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: "0 0 12px" }}>{value.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "rgba(187,247,208,0.45)", lineHeight: 1.75, margin: 0 }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "100px 24px", background: "rgba(3,10,6,0.8)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <motion.div style={{ textAlign: "center", marginBottom: 56 }} {...fadeUp()}>
            <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4ade80", fontWeight: 600 }}>Voices</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#f0fdf4", margin: "12px 0", letterSpacing: "-0.02em" }}>What People Say</h2>
          </motion.div>

          <div style={{ background: "rgba(5,18,11,0.9)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 24, padding: "48px 40px", backdropFilter: "blur(16px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, left: 24, fontSize: 120, color: "rgba(74,222,128,0.06)", fontFamily: "Georgia, serif", lineHeight: 1, userSelect: "none" }}>"</div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1.1rem", color: "rgba(187,247,208,0.75)", fontStyle: "italic", lineHeight: 1.85, marginBottom: 36, position: "relative", zIndex: 1 }}>
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].author} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(74,222,128,0.25)", objectFit: "cover" }} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontWeight: 700, color: "#f0fdf4", margin: 0, fontSize: "0.95rem" }}>{testimonials[activeTestimonial].author}</p>
                    <p style={{ color: "#4ade80", margin: 0, fontSize: "0.82rem" }}>{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 36 }}>
              {[{ fn: prevTestimonial, icon: <ChevronLeft size={16} /> }, { fn: () => setIsPlaying(!isPlaying), icon: isPlaying ? <Pause size={16} /> : <Play size={16} /> }, { fn: nextTestimonial, icon: <ChevronRight size={16} /> }].map((btn, i) => (
                <button key={i} onClick={btn.fn} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", color: "#4ade80", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(74,222,128,0.08)"}
                >{btn.icon}</button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setActiveTestimonial(i); setIsPlaying(false); }}
                  style={{ width: i === activeTestimonial ? 20 : 6, height: 6, borderRadius: 3, background: i === activeTestimonial ? "#4ade80" : "rgba(74,222,128,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(22,163,74,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          <motion.div {...fadeUp()}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 28, fontSize: 13, color: "#4ade80", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
              Take Action
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#f0fdf4", margin: "0 0 20px", letterSpacing: "-0.03em" }}>Ready to Make a<br />Difference?</h2>
            <p style={{ color: "rgba(187,247,208,0.5)", fontSize: "1.05rem", margin: "0 0 40px", lineHeight: 1.75 }}>
              Join thousands of individuals and organizations fighting food waste and hunger in communities around the world.
            </p>
            <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", fontWeight: 600, padding: "16px 40px", borderRadius: 100, textDecoration: "none", fontSize: 16, boxShadow: "0 8px 40px rgba(22,163,74,0.4)", border: "1px solid rgba(74,222,128,0.25)" }}>
              Get Started Today →
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: translateX(-50%) rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .timeline-item { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;