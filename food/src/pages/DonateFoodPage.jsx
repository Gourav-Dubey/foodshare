import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Gift } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import TrackingMap from "../components/ui/TrackingMap";

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://foodsharebackendnew.onrender.com/api";

const SOCKET_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://foodsharebackendnew.onrender.com";

const formatDate = (d) => d
  ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "N/A";
const formatTime = (d) => d
  ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  : "";

// ✅ Geocode with MP fallback — Ganj Basoda jaise towns ke liye
const geocodeLocation = async (location) => {
  const queries = [
    `${location}, Madhya Pradesh, India`,
    `${location}, India`,
    location,
  ];
  for (const q of queries) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=in`,
        { signal: controller.signal, headers: { "Accept-Language": "en" } }
      );
      clearTimeout(tid);
      const data = await res.json();
      if (data.length > 0) {
        console.log(`✅ Geocoded "${q}":`, data[0].lat, data[0].lon, "—", data[0].display_name);
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (e) { console.warn(`Geocode failed for "${q}":`, e.message); }
  }
  return { lat: null, lng: null };
};

const DonorDashboard = ({ donorName = "Donor" }) => {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({ foodName: "", quantity: "", location: "", expiry: "", photo: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ngoLiveLocations, setNgoLiveLocations] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("form");

  const userRef = useRef(user);
  const socketRef = useRef(null);

  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const getToken = () => token || localStorage.getItem("token");

  useEffect(() => {
    // ✅ Socket ek baar — reconnection support
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;

    const fetchDonations = async () => {
      try {
        const res = await axios.get(`${API_URL}/donation/my-donations`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = res.data.data || [];
        setDonations(data);
        const restored = {};
        data.forEach(d => {
          if (d.ngoLiveLocation?.lat) restored[d._id] = d.ngoLiveLocation;
        });
        setNgoLiveLocations(restored);
      } catch (err) { console.error(err); }
    };

    fetchDonations();

    // ✅ Join donor room — reconnect pe bhi
    const joinRoom = () => {
      const myId = userRef.current?._id || userRef.current?.id
        || JSON.parse(localStorage.getItem("user") || "{}")?._id;
      if (myId) {
        socket.emit("joinRoom", myId);
        console.log("✅ Joined donor room:", myId);
      }
    };

    socket.on("connect", () => {
      console.log("✅ Donor socket connected:", socket.id);
      joinRoom();
    });
    joinRoom(); // First connect pe bhi

    // ✅ Private event — OTP ke saath, sirf is donor ko
    socket.on("yourDonationAccepted", (updated) => {
      console.log("🎯 yourDonationAccepted:", updated._id);
      if (updated.ngoLiveLocation?.lat) {
        setNgoLiveLocations(prev => ({ ...prev, [updated._id]: updated.ngoLiveLocation }));
      }
      // ✅ Functional update — always fresh state
      setDonations(prev => prev.map(d => d._id === updated._id ? { ...updated } : d));
    });

    // ✅ Public broadcast — backup
    socket.on("donationAccepted", (updated) => {
      console.log("📢 donationAccepted:", updated._id);
      setDonations(prev => prev.map(d => {
        if (d._id !== updated._id) return d;
        if (d.pickupOtp) return d; // OTP already hai — overwrite mat karo
        return {
          ...d,
          status: "accepted",
          acceptedBy: updated.acceptedBy,
          pickupStatus: updated.pickupStatus || "otp_pending",
          ngoLiveLocation: updated.ngoLiveLocation,
        };
      }));
      if (updated.ngoLiveLocation?.lat) {
        setNgoLiveLocations(prev => ({ ...prev, [updated._id]: updated.ngoLiveLocation }));
      }
    });

    socket.on("donationCancelled", (updated) => {
      console.log("❌ donationCancelled:", updated._id);
      setDonations(prev => prev.map(d =>
        d._id === updated._id
          ? { ...d, status: "pending", acceptedBy: null, pickupStatus: "idle", pickupOtp: null }
          : d
      ));
      setNgoLiveLocations(prev => { const n = { ...prev }; delete n[updated._id]; return n; });
    });

    socket.on("pickupStarted", (updated) => {
      console.log("🚗 pickupStarted:", updated._id);
      setDonations(prev => prev.map(d => d._id === updated._id ? { ...updated } : d));
    });

    socket.on("pickupCompleted", (updated) => {
      console.log("🎉 pickupCompleted:", updated._id);
      setDonations(prev => prev.map(d => d._id === updated._id ? { ...updated } : d));
    });

    return () => { socket.disconnect(); };
  }, []); // ✅ Empty deps — sirf ek baar

  // ✅ NGO live location listeners — fresh on every donation change
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    donations.forEach(d => {
      const ev = `ngoLocation_${d._id}`;
      socket.off(ev);
      if (d.pickupStatus === "otp_pending" || d.pickupStatus === "on_the_way") {
        socket.on(ev, loc => {
          console.log(`📍 NGO location for ${d._id}:`, loc);
          setNgoLiveLocations(prev => ({ ...prev, [d._id]: loc }));
        });
      }
    });
    return () => {
      donations.forEach(d => socketRef.current?.off(`ngoLocation_${d._id}`));
    };
  }, [donations]);

  // ✅ onChange — functional update, no stale formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ FAST Submit — geocode 3s timeout, parallel with form prep
  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  if (!formData.foodName || !formData.quantity || !formData.location || !formData.expiry || !formData.photo) {
    setMessage("⚠️ Please fill all fields including photo!"); return;
  }
  setLoading(true);

  // ✅ Device ki real GPS location lo — text se geocoding nahi
  let donorLat = null, donorLng = null;
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true, timeout: 8000, maximumAge: 0
      })
    );
    donorLat = pos.coords.latitude;
    donorLng = pos.coords.longitude;
    console.log("✅ Donor GPS location:", donorLat, donorLng);
  } catch (e) {
    console.warn("GPS failed, submitting without location:", e.message);
    // Location nahi mili toh bhi submit hoga — map nahi dikhega bas
  }

  try {
    const data = new FormData();
    data.append("foodName", formData.foodName);
    data.append("quantity", formData.quantity);
    data.append("location", formData.location);
    data.append("expiry", formData.expiry);
    data.append("photo", formData.photo);
    if (donorLat) data.append("donorLat", String(donorLat));
    if (donorLng) data.append("donorLng", String(donorLng));

    const res = await axios.post(`${API_URL}/donation`, data, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${getToken()}` },
    });
    setDonations(prev => [res.data.data, ...prev]);
    setFormData({ foodName: "", quantity: "", location: "", expiry: "", photo: null });
    setPreview(null);
    setMessage("✅ Donation submitted successfully!");
    if (isMobile) setActiveTab("list");
  } catch (err) {
    setMessage(err.response?.data?.error || "❌ Failed to submit");
  } finally {
    setLoading(false);
  }
};

  const getBadge = (donation) => {
    const base = { display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 };
    if (donation.status === "completed") return <div style={{ ...base, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa" }}>🎉 Delivered by {donation.acceptedBy?.name || "NGO"}</div>;
    if (donation.status === "accepted") return <div style={{ ...base, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>✅ Accepted by {donation.acceptedBy?.name || "NGO"}</div>;
    return <div style={{ ...base, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24" }}>⏳ Pending NGO Approval</div>;
  };

  const getTrackingSection = (donation) => {
    const hasLocation = donation.donorLocation?.lat && donation.donorLocation?.lng;
    const ngoLoc = ngoLiveLocations[donation._id] || donation.ngoLiveLocation;

    if (donation.pickupStatus === "otp_pending") {
      return (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24", display: "inline-block", animation: "donpulse 1.5s infinite" }} />
            <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>🚗 NGO aapki taraf aa rahi hai!</span>
          </div>
          {hasLocation && (
            <>
              <TrackingMap
                ngoLocation={ngoLoc}
                donorLocation={donation.donorLocation}
                donorAddress={donation.donorLocation?.address || donation.location}
                isNgo={false}
                showRoute={true}
              />
              <div style={{ display: "flex", gap: 12, margin: "6px 0 10px", fontSize: 11, color: "rgba(187,247,208,0.4)" }}>
                <span>🟢 NGO</span><span>🔴 Aapka pickup</span>
              </div>
            </>
          )}
          {donation.pickupOtp && (
            <div style={{ background: "rgba(234,179,8,0.06)", border: "2px solid rgba(234,179,8,0.4)", borderRadius: 12, padding: "12px" }}>
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>
                🔐 NGO aaye toh yeh OTP dikhao
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {donation.pickupOtp.split("").map((digit, i) => (
                  <div key={i} style={{ width: 48, height: 58, background: "rgba(234,179,8,0.15)", border: "2px solid #fbbf24", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", fontWeight: 900, color: "#fbbf24" }}>
                    {digit}
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(187,247,208,0.4)", fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>⚠️ Sirf aapko dikhai deta hai</p>
            </div>
          )}
        </div>
      );
    }

    if (donation.pickupStatus === "on_the_way") {
      return (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa", display: "inline-block", animation: "donpulse 1.5s infinite" }} />
            <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 600 }}>✅ Food pickup ho gaya! NGO deliver kar rahi hai</span>
          </div>
          <TrackingMap
            ngoLocation={ngoLoc}
            donorLocation={donation.donorLocation}
            donorAddress={donation.donorLocation?.address || donation.location}
            isNgo={false}
            showRoute={true}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: "rgba(187,247,208,0.4)" }}>
            <span>🟢 NGO</span><span>🔴 Aapka pickup</span>
          </div>
        </div>
      );
    }

    if (donation.pickupStatus === "completed" || donation.status === "completed") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 10, padding: "10px 12px", marginTop: 10 }}>
          <span>🎉</span>
          <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 600 }}>Food Delivered Successfully!</span>
        </div>
      );
    }

    if (donation.status === "pending" && hasLocation) {
      return (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 12, color: "rgba(187,247,208,0.4)", margin: "0 0 6px" }}>📍 Aapki pickup location</p>
          <TrackingMap ngoLocation={null} donorLocation={donation.donorLocation} donorAddress={donation.location} isNgo={false} showRoute={false} />
        </div>
      );
    }
    return null;
  };

  // ✅ Input + label styles — defined once, no re-creation
  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: 12, padding: "12px 14px",
    color: "#ecfdf5", fontSize: 16, outline: "none",
    fontFamily: "inherit", caretColor: "#4ade80"
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "rgba(74,222,128,0.85)", marginBottom: 6
  };
  const onFocus = (e) => { e.target.style.borderColor = "rgba(74,222,128,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.15)"; };
  const onBlur = (e) => { e.target.style.borderColor = "rgba(34,197,94,0.3)"; e.target.style.boxShadow = "none"; };

  // ✅ formJSX — variable, NOT a component function inside render
  // This is the key fix — no unmount/remount on state change
  const formJSX = (
    <div style={{ background: "rgba(8,28,16,0.95)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 20, padding: "20px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(74,222,128,0.5),transparent)" }} />
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>🍲 Donate Food</h2>

      {message && (
        <div style={{
          background: message.includes("✅") ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${message.includes("✅") ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.25)"}`,
          color: message.includes("✅") ? "#4ade80" : "#fca5a5",
          borderRadius: 10, padding: "10px 14px", fontSize: 13, textAlign: "center", marginBottom: 14
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { name: "foodName", label: "Food Name", placeholder: "e.g. Biryani, Roti", type: "text" },
          { name: "quantity", label: "Quantity", placeholder: "e.g. 5 plates", type: "text" },
          { name: "location", label: "Pickup Location", placeholder: "e.g. Ganj Basoda, MP", type: "text" },
          { name: "expiry", label: "Expiry Date & Time", placeholder: "", type: "datetime-local" },
        ].map(f => (
          <div key={f.name} style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              placeholder={f.placeholder}
              value={formData[f.name]}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              style={inputStyle}
            />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Food Photo</label>
          <label style={{ border: "1.5px dashed rgba(34,197,94,0.2)", borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)" }}>
            <Upload size={24} color="rgba(74,222,128,0.6)" />
            <span style={{ fontSize: 13, color: "rgba(187,247,208,0.45)", marginTop: 8 }}>Click to upload food photo</span>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            {preview && <img src={preview} alt="Preview" style={{ marginTop: 12, width: 100, height: 100, objectFit: "cover", borderRadius: 10 }} />}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? "rgba(22,163,74,0.4)" : "linear-gradient(135deg,#14532d,#16a34a)",
            border: "none", borderRadius: 13, color: "#fff",
            fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "all 0.2s"
          }}
        >
          {loading ? "Submitting..." : "Submit Donation"}
        </button>
      </form>
    </div>
  );

  // ✅ listJSX — variable, NOT a component function
  const listJSX = (
    <div>
      <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f0fdf4", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        📋 Your Submissions
        <span style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, marginLeft: 4 }}>
          {donations.length}
        </span>
      </h2>
      {donations.length === 0
        ? <div style={{ color: "rgba(187,247,208,0.35)", fontSize: "0.9rem", textAlign: "center", padding: "36px 16px", background: "rgba(5,18,11,0.6)", borderRadius: 16, border: "1px solid rgba(34,197,94,0.08)" }}>
            No donations submitted yet.
          </div>
        : donations.map(donation => (
            <div key={donation._id} style={{ background: "rgba(5,18,11,0.85)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
              {donation.photo && (
                <img src={donation.photo} alt={donation.foodName} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
              )}
              <div style={{ padding: "14px" }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0fdf4", margin: "0 0 6px" }}>{donation.foodName}</p>
                <p style={{ fontSize: 13, color: "rgba(187,247,208,0.5)", margin: "0 0 3px" }}>🍴 {donation.quantity}</p>
                <p style={{ fontSize: 13, color: "rgba(187,247,208,0.5)", margin: "0 0 3px" }}>📍 {donation.location}</p>
                <p style={{ fontSize: 12, color: "rgba(187,247,208,0.3)", margin: 0 }}>🕐 {formatDate(donation.createdAt)} {formatTime(donation.createdAt)}</p>
                {getBadge(donation)}
                {getTrackingSection(donation)}
              </div>
            </div>
          ))
      }
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-8%", left: "10%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle,rgba(22,163,74,0.13) 0%,transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.025) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: isMobile ? "66px 14px 90px 14px" : "24px 100px 60px 110px" }}>

        {/* Welcome */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#14532d,#16a34a)", color: "#fff", padding: "9px 18px", borderRadius: 14, boxShadow: "0 8px 32px rgba(22,163,74,0.3)", border: "1px solid rgba(74,222,128,0.25)", flexWrap: "wrap", justifyContent: "center" }}>
            <Gift size={18} />
            <span style={{ fontSize: "1rem", fontWeight: 700 }}>Welcome, {user?.name || donorName}! 🌟</span>
          </div>
          <p style={{ color: "rgba(187,247,208,0.5)", marginTop: 8, fontSize: "0.88rem" }}>
            "Your small contribution can make a big difference." 💚
          </p>
        </div>

        {/* Mobile Tabs */}
        {isMobile && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { key: "form", label: "➕ Donate" },
              { key: "list", label: `📋 Donations (${donations.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
                fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: activeTab === tab.key ? "#16a34a" : "rgba(255,255,255,0.06)",
                color: activeTab === tab.key ? "#fff" : "rgba(187,247,208,0.5)",
                transition: "all 0.2s"
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ✅ JSX variables directly — no separate component = no blink */}
        {isMobile ? (
          <>
            {activeTab === "form" && formJSX}
            {activeTab === "list" && listJSX}
          </>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
            {formJSX}
            {listJSX}
          </div>
        )}
      </div>

      <style>{`
        @keyframes donpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        *{box-sizing:border-box}
        input::placeholder{color:rgba(167,243,208,0.4)}
        input[type="datetime-local"]::-webkit-calendar-picker-indicator{filter:invert(0.7) sepia(1) saturate(3) hue-rotate(90deg);cursor:pointer}
      `}</style>
    </div>
  );
};

export default DonorDashboard;