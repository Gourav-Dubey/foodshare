import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background: #060d0d;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(52,211,153,0.12);
        }

        .footer-grid-v { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.02); pointer-events: none; }

        .footer-nav-link {
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: color 0.25s;
          position: relative;
          padding-bottom: 2px;
        }
        .footer-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #34d399;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .footer-nav-link:hover { color: #86efac; }
        .footer-nav-link:hover::after { width: 100%; }

        .divider-glow {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.3), rgba(52,211,153,0.1), transparent);
        }

        .logo-mark {
          width: 42px; height: 42px;
          border-radius: 13px;
          background: linear-gradient(135deg, #4ade80, #059669);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 20px rgba(52,211,153,0.3);
          flex-shrink: 0;
        }
      `}</style>

      <footer className="footer-root pt-12 pb-6">

        {/* Grid decoration */}
        {[25, 50, 75].map(l => (
          <div key={l} className="footer-grid-v" style={{ left: `${l}%` }} />
        ))}

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', bottom: -60, left: '35%',
          width: 380, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(52,211,153,0.05) 0%,transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none'
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Main Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">

            {/* Brand */}
            <div className="flex flex-col gap-4 max-w-sm">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="logo-mark">🍲</div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: 20,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}>
                  Food Share Network
                </h2>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 300, lineHeight: 1.75 }}>
                Sharing food, spreading smiles — because every meal is an act of love. 🌍
              </p>

              {/* Impact stat pills */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                {[
                  { emoji: '🍽️', value: '2M+', label: 'Meals' },
                  { emoji: '🤝', value: '500+', label: 'NGOs' },
                  { emoji: '🌱', value: '50K+', label: 'Volunteers' },
                ].map(({ emoji, value, label }) => (
                  <span key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: 'rgba(52,211,153,0.07)',
                    border: '1px solid rgba(52,211,153,0.18)',
                    fontSize: 12, fontWeight: 600,
                    color: '#86efac',
                  }}>
                    {emoji} {value} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col gap-3">
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 4
              }}>
                Navigate
              </span>
              {[
                ['/', '🏠', 'Home'],
                ['/about', '💡', 'About'],
                ['/contact', '✉️', 'Contact'],
              ].map(([to, emoji, label]) => (
                <Link key={to} to={to} className="footer-nav-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{emoji}</span> {label}
                </Link>
              ))}
            </div>

            {/* Our Values */}
            <div className="flex flex-col gap-3">
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 4
              }}>
                Our Values
              </span>
              {[
                ['♻️', 'Zero Food Waste'],
                ['❤️', 'Community First'],
                ['🔒', 'Safety Verified'],
                ['⚡', 'Fast Delivery'],
              ].map(([emoji, text]) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 300,
                }}>
                  <span style={{ fontSize: 15 }}>{emoji}</span> {text}
                </div>
              ))}
            </div>

          </div>

          {/* Divider */}
          <div className="divider-glow mb-5" />

          {/* Bottom bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontWeight: 300 }}>
              © {new Date().getFullYear()}{' '}
              <span style={{ color: 'rgba(134,239,172,0.7)', fontWeight: 500 }}>Food Share Network</span>
              . All rights reserved.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>
              Made with 💚 to fight hunger &amp; reduce food waste
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;