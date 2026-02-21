import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Gift } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://foodsharebackendnew.onrender.com/api";

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://foodsharebackendnew.onrender.com"
);

const S = {
  root: {
    minHeight: "100vh",
    marginTop: 48,
    background: "#080f0b",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute", inset: 0, pointerEvents: "none",
  },
  orb1: {
    position: "absolute", top: "-8%", left: "10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(22,163,74,0.13) 0%, transparent 70%)",
    filter: "blur(50px)",
  },
  orb2: {
    position: "absolute", bottom: "5%", right: "5%",
    width: 380, height: 380, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
    filter: "blur(50px)",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  },
  inner: { position: "relative", zIndex: 1 },

  // Welcome banner
  welcomeWrap: { textAlign: "center", marginBottom: 40 },
  welcomeBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "linear-gradient(135deg, #14532d, #16a34a)",
    color: "#fff", padding: "10px 20px", borderRadius: 16,
    boxShadow: "0 8px 32px rgba(22,163,74,0.35)",
    border: "1px solid rgba(74,222,128,0.25)",
    maxWidth: "90vw", flexWrap: "wrap", justifyContent: "center",
  },
  welcomeTitle: { fontSize: "1.1rem", fontWeight: 700, margin: 0 },
  welcomeSub: { color: "rgba(187,247,208,0.5)", marginTop: 12, fontSize: "0.95rem" },

  // Grid
  gridLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    alignItems: "start",
  },

  // Form card
  formCard: {
    background: "rgba(8,28,16,0.95)",
    border: "1px solid rgba(34,197,94,0.12)",
    borderRadius: 20, padding: "24px 20px",
    backdropFilter: "blur(16px)",
    position: "relative", overflow: "hidden",
    width: "100%",
  },
  formTopLine: {
    position: "absolute", top: 0, left: 0, right: 0, height: 2,
    background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent)",
  },
  formTitle: {
    fontSize: "1.25rem", fontWeight: 800, color: "#ffffff",
    marginBottom: 24, display: "flex", alignItems: "center", gap: 8,
  },

  // Input
  inputWrap: { marginBottom: 18 },
  inputLabel: {
    display: "block", fontSize: 11, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: "rgba(74,222,128,0.85)", marginBottom: 6,
  },
  input: {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: 12, padding: "13px 16px",
    color: "#ecfdf5", fontSize: 14, outline: "none",
    fontFamily: "inherit", caretColor: "#4ade80",
    transition: "border 0.2s, box-shadow 0.2s",
  },

  // Upload
  uploadBox: {
    border: "1.5px dashed rgba(34,197,94,0.2)",
    borderRadius: 14, padding: "24px 16px",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    cursor: "pointer", marginBottom: 16,
    background: "rgba(255,255,255,0.02)",
    transition: "background 0.2s",
  },
  uploadLabel: {
    fontSize: 13, color: "rgba(187,247,208,0.45)",
    marginTop: 8, cursor: "pointer",
  },

  // Message
  msgSuccess: {
    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
    color: "#4ade80", borderRadius: 10, padding: "10px 14px",
    fontSize: 13, textAlign: "center", marginBottom: 16,
  },
  msgError: {
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5", borderRadius: 10, padding: "10px 14px",
    fontSize: 13, textAlign: "center", marginBottom: 16,
  },

  // Submit btn
  submitBtn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #14532d, #16a34a)",
    border: "none", borderRadius: 13, color: "#fff",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 6px 24px rgba(22,163,74,0.3)",
    fontFamily: "inherit", letterSpacing: "0.02em",
    transition: "opacity 0.2s",
  },

  // Submissions panel
  subTitle: {
    fontSize: "1.2rem", fontWeight: 700, color: "#f0fdf4",
    marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
  },
  emptyState: {
    color: "rgba(187,247,208,0.35)", fontSize: "0.9rem",
    textAlign: "center", padding: "40px 20px",
    background: "rgba(5,18,11,0.6)", borderRadius: 16,
    border: "1px solid rgba(34,197,94,0.08)",
  },

  // Donation card
  donCard: {
    background: "rgba(5,18,11,0.85)",
    border: "1px solid rgba(34,197,94,0.1)",
    borderRadius: 18, overflow: "hidden",
    backdropFilter: "blur(12px)",
    marginBottom: 0,
  },
  donImg: { width: "100%", height: 160, objectFit: "cover", display: "block" },
  donBody: { padding: "16px 20px" },
  donName: { fontWeight: 700, fontSize: "1rem", color: "#f0fdf4", margin: "0 0 10px" },
  donRow: { fontSize: 13, color: "rgba(187,247,208,0.5)", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 },
  badgeAccepted: {
    display: "inline-flex", alignItems: "center", gap: 5,
    marginTop: 10, padding: "4px 12px", borderRadius: 100,
    background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)",
    color: "#4ade80", fontSize: 12, fontWeight: 600,
  },
  badgePending: {
    display: "inline-flex", alignItems: "center", gap: 5,
    marginTop: 10, padding: "4px 12px", borderRadius: 100,
    background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)",
    color: "#fbbf24", fontSize: 12, fontWeight: 600,
  },
};

const DonorDashboard = ({ donorName = "Donor" }) => {
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    foodName: "", quantity: "", location: "", expiry: "", photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("donationAccepted", (updatedDonation) => {
      setDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== updatedDonation._id);
        return [updatedDonation, ...filtered];
      });
    });

    socket.on("donationCancelled", (updatedDonation) => {
      setDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== updatedDonation._id);
        return [updatedDonation, ...filtered];
      });
    });

    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/donation/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const acceptedRes = await axios.get(`${API_URL}/donation/accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allDonations = [...res.data.data, ...acceptedRes.data.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDonations(allDonations);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();

    return () => {
      socket.off("donationAccepted");
      socket.off("donationCancelled");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.foodName || !formData.quantity || !formData.location || !formData.expiry || !formData.photo) {
      setMessage("⚠️ Please fill all fields including photo!");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("foodName", formData.foodName);
      data.append("quantity", formData.quantity);
      data.append("location", formData.location);
      data.append("expiry", formData.expiry);
      data.append("photo", formData.photo);

      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/donation`, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      const newDonation = res.data.data;
      setDonations((prev) => [newDonation, ...prev]);
      setFormData({ foodName: "", quantity: "", location: "", expiry: "", photo: null });
      setPreview(null);
      setMessage("✅ Donation submitted successfully!");
    } catch (err) {
      console.error("Error submitting donation:", err.response?.data || err);
      setMessage(err.response?.data?.error || "❌ Failed to submit donation");
    } finally {
      setLoading(false);
    }
  };

  const onInputFocus = (e) => {
    e.target.style.borderColor = "rgba(74,222,128,0.7)";
    e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)";
    e.target.style.background = "rgba(255,255,255,0.09)";
  };
  const onInputBlur = (e) => {
    e.target.style.borderColor = "rgba(34,197,94,0.3)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(255,255,255,0.06)";
  };

  const isSuccess = message.includes("✅");

  const fields = [
    { name: "foodName", label: "Food Name", placeholder: "e.g. Biryani, Roti", type: "text" },
    { name: "quantity", label: "Quantity", placeholder: "e.g. 5 plates", type: "text" },
    { name: "location", label: "Pickup Location", placeholder: "Enter pickup address", type: "text" },
    { name: "expiry", label: "Expiry Time", placeholder: "e.g. 2 hours", type: "text" },
  ];

  return (
    <div style={S.root} className="donor-root">
      {/* Background */}
      <div style={S.bg}>
        <div style={S.orb1} /><div style={S.orb2} /><div style={S.grid} />
      </div>

      <div style={S.inner} className="donor-inner">
        {/* Welcome */}
        <motion.div style={S.welcomeWrap} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={S.welcomeBadge}>
            <Gift size={20} />
            <h1 style={S.welcomeTitle}>Welcome back, {donorName}! 🌟</h1>
          </div>
          <p style={S.welcomeSub}>"Your small contribution can make a big difference." 💚</p>
        </motion.div>

        {/* Main grid */}
        <div className="donor-grid">

          {/* ── Donation Form ── */}
          <motion.div style={S.formCard} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div style={S.formTopLine} />
            <h2 style={S.formTitle}>
              <span style={{ fontSize: 20 }}>🍲</span> Donate Food
            </h2>

            {message && (
              <div style={isSuccess ? S.msgSuccess : S.msgError}>{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              {fields.map((f) => (
                <div key={f.name} style={S.inputWrap}>
                  <label style={S.inputLabel}>{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    value={formData[f.name]}
                    onChange={handleChange}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    style={S.input}
                  />
                </div>
              ))}

              {/* Upload */}
              <div style={S.inputWrap}>
                <label style={S.inputLabel}>Food Photo</label>
                <label style={S.uploadBox}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                >
                  <Upload size={28} color="rgba(74,222,128,0.6)" />
                  <span style={S.uploadLabel}>Click to upload food photo</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  {preview && (
                    <img src={preview} alt="Preview" style={{ marginTop: 14, width: 120, height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(74,222,128,0.2)" }} />
                  )}
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                style={{ ...S.submitBtn, opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Submitting..." : "Submit Donation"}
              </motion.button>
            </form>
          </motion.div>

          {/* ── Submissions ── */}
          <div style={{ width: "100%" }}>
            <h2 style={S.subTitle}>
              <span style={{ fontSize: 20 }}>📋</span> Your Submissions
            </h2>

            {donations.length === 0 ? (
              <div style={S.emptyState}>No donations submitted yet.</div>
            ) : (
              <div className="donor-sub-grid">
                {donations.map((donation) => (
                  <motion.div
                    key={donation._id || donation.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    style={S.donCard}
                  >
                    <img
                      src={donation.photo || "https://source.unsplash.com/400x300/?food"}
                      alt={donation.foodName}
                      style={S.donImg}
                    />
                    <div style={S.donBody}>
                      <p style={S.donName}>{donation.foodName}</p>
                      <p style={S.donRow}>🍴 <span>Quantity: {donation.quantity}</span></p>
                      <p style={S.donRow}>📍 <span>Location: {donation.location}</span></p>
                      <p style={S.donRow}>⏰ <span>Expiry: {donation.expiry}</span></p>
                      <div style={donation.status === "accepted" ? S.badgeAccepted : S.badgePending}>
                        {donation.status === "accepted" ? "✅ Accepted by NGO" : "⏳ Pending NGO Approval"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(167,243,208,0.45); }

        .donor-root {
          padding: 28px 100px 60px 110px;
        }
        .donor-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .donor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .donor-sub-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .donor-root {
            padding: 28px 80px 60px 90px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .donor-root {
            padding: 20px 16px 48px 16px !important;
          }
          .donor-inner {
            max-width: 100%;
          }
          .donor-grid {
            grid-template-columns: 1fr !important;
            gap: 24px;
          }
          .donor-sub-grid {
            grid-template-columns: 1fr !important;
          }
          input, button {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DonorDashboard;