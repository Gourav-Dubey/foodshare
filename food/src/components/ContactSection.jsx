import React, { useState } from "react";
import { motion } from "framer-motion";

const teamContacts = [
  {
    name: "Gourav Dubey",
    role: "Founder & Visionary",
    img: "6.jpg",
    email: "gourav@foodshare.org",
    phone: "+91 98765 43210",
    location: "Bhopal, India",
    color: "#4ade80",
  },
  {
    name: "Manish Tiwari",
    role: "Co-Founder & Operations Lead",
    img: "7.jpg",
    email: "manish@foodshare.org",
    phone: "+91 91234 56789",
    location: "Mumbai, India",
    color: "#60a5fa",
  },
  {
    name: "Mayank Tiwari",
    role: "Tech Innovator",
    img: "8.jpg",
    email: "mayank@foodshare.org",
    phone: "+91 87654 32109",
    location: "Indore, India",
    color: "#c084fc",
  },
  {
    name: "Rohit Thakur",
    role: "Community Manager",
    img: "9.jpg",
    email: "rohit@foodshare.org",
    phone: "+91 76543 21098",
    location: "Delhi, India",
    color: "#fb923c",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true, margin: "-60px" },
});

const ContactSection = () => {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <section
      id="contact"
      style={{
        background: "#080f0b",
        minHeight: "100vh",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Ambient background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-5%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.13) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <motion.div style={{ textAlign: "center", marginBottom: 72 }} {...fadeUp()}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 12, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
            Contact Us
          </div>
          <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#f0fdf4", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Get in{" "}
            <span style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Touch
            </span>
          </h2>
          <p style={{ color: "rgba(187,247,208,0.5)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            Reach out directly to any of our team members — we'd love to hear from you.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {teamContacts.map((member, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              style={{
                background: "rgba(5,18,11,0.85)",
                border: "1px solid rgba(34,197,94,0.1)",
                borderRadius: 22,
                overflow: "hidden",
                backdropFilter: "blur(16px)",
                position: "relative",
              }}
            >
              {/* Top accent line with member color */}
              <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${member.color}, transparent)` }} />

              {/* Card content */}
              <div style={{ padding: "32px 28px" }}>

                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={member.img}
                      alt={member.name}
                      style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${member.color}40`, display: "block" }}
                    />
                    {/* Online dot */}
                    <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#4ade80", border: "2px solid #080f0b", boxShadow: "0 0 6px #4ade80" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f0fdf4", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{member.name}</h3>
                    <p style={{ fontSize: 12, color: member.color, fontWeight: 600, margin: 0, letterSpacing: "0.02em" }}>{member.role}</p>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(34,197,94,0.08)", marginBottom: 24 }} />

                {/* Contact details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Email */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${member.color}12`, border: `1px solid ${member.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={member.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 10, color: "rgba(187,247,208,0.3)", margin: "0 0 1px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Email</p>
                        <p style={{ fontSize: 13, color: "rgba(187,247,208,0.7)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(member.email, `email-${i}`)}
                      title="Copy email"
                      style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: copied === `email-${i}` ? `${member.color}25` : "rgba(255,255,255,0.04)", border: `1px solid ${copied === `email-${i}` ? member.color + "50" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: copied === `email-${i}` ? member.color : "rgba(167,243,208,0.35)" }}
                    >
                      {copied === `email-${i}` ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${member.color}12`, border: `1px solid ${member.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={member.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.76h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: "rgba(187,247,208,0.3)", margin: "0 0 1px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Phone</p>
                        <p style={{ fontSize: 13, color: "rgba(187,247,208,0.7)", margin: 0 }}>{member.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(member.phone, `phone-${i}`)}
                      title="Copy phone"
                      style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: copied === `phone-${i}` ? `${member.color}25` : "rgba(255,255,255,0.04)", border: `1px solid ${copied === `phone-${i}` ? member.color + "50" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: copied === `phone-${i}` ? member.color : "rgba(167,243,208,0.35)" }}
                    >
                      {copied === `phone-${i}` ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Location */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${member.color}12`, border: `1px solid ${member.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={member.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: "rgba(187,247,208,0.3)", margin: "0 0 1px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Location</p>
                      <p style={{ fontSize: 13, color: "rgba(187,247,208,0.7)", margin: 0 }}>{member.location}</p>
                    </div>
                  </div>
                </div>

                {/* CTA button */}
                <a
                  href={`mailto:${member.email}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24, padding: "11px 0", borderRadius: 12, background: `${member.color}12`, border: `1px solid ${member.color}30`, color: member.color, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s", letterSpacing: "0.02em" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${member.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${member.color}12`; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Send Email
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom general info bar */}
        <motion.div
          {...fadeUp(0.4)}
          style={{ marginTop: 40, background: "rgba(5,18,11,0.8)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 18, padding: "28px 36px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, backdropFilter: "blur(12px)" }}
        >
          <div>
            <p style={{ fontSize: 12, color: "rgba(187,247,208,0.3)", margin: "0 0 4px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>General Enquiries</p>
            <p style={{ fontSize: "1rem", color: "#f0fdf4", fontWeight: 600, margin: 0 }}>support@foodshare.org</p>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(34,197,94,0.1)" }} />
          <div>
            <p style={{ fontSize: 12, color: "rgba(187,247,208,0.3)", margin: "0 0 4px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Helpline</p>
            <p style={{ fontSize: "1rem", color: "#f0fdf4", fontWeight: 600, margin: 0 }}>+91 98765 43210</p>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(34,197,94,0.1)" }} />
          <div>
            <p style={{ fontSize: 12, color: "rgba(187,247,208,0.3)", margin: "0 0 4px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Headquarters</p>
            <p style={{ fontSize: "1rem", color: "#f0fdf4", fontWeight: 600, margin: 0 }}>Bhopal, Madhya Pradesh, India</p>
          </div>
          <a
            href="mailto:support@foodshare.org"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", fontWeight: 600, padding: "12px 28px", borderRadius: 100, textDecoration: "none", fontSize: 14, boxShadow: "0 6px 24px rgba(22,163,74,0.3)", border: "1px solid rgba(74,222,128,0.2)", whiteSpace: "nowrap" }}
          >
            Contact Us →
          </a>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
      `}</style>
    </section>
  );
};

export default ContactSection;