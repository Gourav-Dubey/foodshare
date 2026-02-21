import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { CheckCircle, XCircle } from "lucide-react";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://foodsharebackendnew.onrender.com/api";

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://foodsharebackendnew.onrender.com"
);

const NgoDashboard = () => {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const pendingRes = await axios.get(`${API_URL}/donation/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const acceptedRes = await axios.get(`${API_URL}/donation/accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingDonations((pendingRes.data.data || []).reverse());
        setAcceptedDonations((acceptedRes.data.data || []).reverse());
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();

    socket.on("connect", () => console.log("WebSocket connected:", socket.id));
    socket.on("disconnect", () => console.log("WebSocket disconnected"));

    socket.on("newDonation", (donation) => {
      setPendingDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [donation, ...filtered];
      });
    });

    socket.on("donationAccepted", (donation) => {
      setPendingDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setAcceptedDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [donation, ...filtered];
      });
    });

    socket.on("donationCancelled", (donation) => {
      setAcceptedDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setPendingDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [donation, ...filtered];
      });
    });

    return () => {
      socket.off("newDonation");
      socket.off("donationAccepted");
      socket.off("donationCancelled");
    };
  }, []);

  const handleAccept = async (donation) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/donation/accept/${donation._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setAcceptedDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [res.data.data, ...filtered];
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (donation) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/donation/cancel/${donation._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setPendingDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [res.data.data, ...filtered];
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderDonationCard = (d, action, isPending) => (
    <div
      key={d._id}
      style={{
        background: "rgba(5,18,11,0.85)",
        border: `1px solid ${isPending ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)"}`,
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        transition: "border 0.2s",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: isPending
          ? "linear-gradient(to bottom, #fbbf24, #f59e0b)"
          : "linear-gradient(to bottom, #4ade80, #16a34a)",
        borderRadius: "16px 0 0 16px",
      }} />

      <div className="ngo-card-inner" style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 8, flex: 1 }}>
        {d.photo && (
          <img
            src={d.photo}
            alt={d.foodName}
            style={{
              width: 72, height: 72, objectFit: "cover",
              borderRadius: 12,
              border: "1px solid rgba(34,197,94,0.2)",
              flexShrink: 0,
            }}
          />
        )}
        <div>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "#f0fdf4", margin: "0 0 6px" }}>
            {d.foodName}
          </p>
          <p style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", margin: "0 0 3px", display: "flex", alignItems: "center", gap: 5 }}>
            🍴 {d.quantity}
          </p>
          <p style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", margin: "0 0 3px", display: "flex", alignItems: "center", gap: 5 }}>
            📍 {d.location}
          </p>
          <p style={{ fontSize: 13, color: "rgba(187,247,208,0.45)", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
            ⏰ {d.expiry}
          </p>
        </div>
      </div>

      {action}
    </div>
  );

  return (
    <div className="ngo-root" style={{
      minHeight: "100vh",
      background: "#080f0b",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-5%", left: "20%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div className="ngo-inner" style={{ position: "relative", zIndex: 1 }}>

        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 16, fontSize: 12, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
            Live Dashboard
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#f0fdf4", margin: 0, letterSpacing: "-0.03em" }}>
            NGO Dashboard
          </h1>
          <p style={{ color: "rgba(187,247,208,0.45)", marginTop: 8, fontSize: "0.95rem" }}>
            Manage incoming food donations in real-time
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
          {[
            { label: "Pending", count: pendingDonations.length, color: "#fbbf24", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
            { label: "Accepted", count: acceptedDonations.length, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
            { label: "Total", count: pendingDonations.length + acceptedDonations.length, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="ngo-grid">

          {/* ── Pending Donations ── */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>
                Pending Donations
              </h2>
              <span style={{ marginLeft: "auto", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                {pendingDonations.length}
              </span>
            </div>

            {pendingDonations.length === 0 ? (
              <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: "0.9rem" }}>
                No pending donations.
              </div>
            ) : (
              pendingDonations.map((d) =>
                renderDonationCard(d,
                  <button
                    onClick={() => handleAccept(d)}
                    className="ngo-action-btn"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "linear-gradient(135deg, #14532d, #16a34a)",
                      color: "#fff", border: "1px solid rgba(74,222,128,0.25)",
                      borderRadius: 10, padding: "9px 18px",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(22,163,74,0.25)",
                      whiteSpace: "nowrap", flexShrink: 0,
                      fontFamily: "inherit",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <CheckCircle size={15} /> Accept
                  </button>,
                  true
                )
              )
            )}
          </section>

          {/* ── Accepted Donations ── */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>
                Accepted Donations
              </h2>
              <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                {acceptedDonations.length}
              </span>
            </div>

            {acceptedDonations.length === 0 ? (
              <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: "0.9rem" }}>
                No accepted donations.
              </div>
            ) : (
              acceptedDonations.map((d) =>
                renderDonationCard(d,
                  <button
                    onClick={() => handleCancel(d)}
                    className="ngo-action-btn"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "rgba(239,68,68,0.1)",
                      color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: 10, padding: "9px 18px",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      whiteSpace: "nowrap", flexShrink: 0,
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
                  >
                    <XCircle size={15} /> Cancel
                  </button>,
                  false
                )
              )
            )}
          </section>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }

        .ngo-root {
          padding: 80px 28px 60px 110px;
        }
        .ngo-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .ngo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .ngo-root {
            padding: 72px 20px 60px 90px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .ngo-root {
            padding: 72px 14px 48px 14px !important;
          }
          .ngo-inner {
            max-width: 100%;
          }
          .ngo-grid {
            grid-template-columns: 1fr !important;
            gap: 32px;
          }
          /* Card inner content stack on small screens */
          .ngo-card-inner {
            flex-wrap: wrap;
            gap: 12px;
          }
          .ngo-card-inner .ngo-action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default NgoDashboard;