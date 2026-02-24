import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { CheckCircle, XCircle } from "lucide-react";
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

const NgoDashboard = () => {
  const { user, token } = useAuth();
  const [pendingDonations, setPendingDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [ngoLiveLocations, setNgoLiveLocations] = useState({});
  const [otpInputs, setOtpInputs] = useState({});
  const [otpErrors, setOtpErrors] = useState({});
  const [otpLoading, setOtpLoading] = useState({});
  const [activeTab, setActiveTab] = useState("pending");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const userRef = useRef(user);
  const locationIntervals = useRef({});
  const socketRef = useRef(null);

  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const getToken = () => token || localStorage.getItem("token");

  const startLocationInterval = useCallback((donationId) => {
    if (locationIntervals.current[donationId]) {
      clearInterval(locationIntervals.current[donationId]);
    }
    const t = getToken();
    locationIntervals.current[donationId] = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (p) => {
          const lat = p.coords.latitude;
          const lng = p.coords.longitude;
          setNgoLiveLocations(prev => ({ ...prev, [donationId]: { lat, lng } }));
          try {
            await axios.put(
              `${API_URL}/donation/update-location/${donationId}`,
              { lat, lng },
              { headers: { Authorization: `Bearer ${t}` } }
            );
          } catch (e) { console.warn("Location update failed:", e); }
        },
        (e) => console.warn("Geo error:", e),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }, 4000);
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;

    const fetchDonations = async () => {
      try {
        const t = getToken();
        const [pendingRes, acceptedRes] = await Promise.all([
          axios.get(`${API_URL}/donation/pending`, { headers: { Authorization: `Bearer ${t}` } }),
          axios.get(`${API_URL}/donation/accepted`, { headers: { Authorization: `Bearer ${t}` } }),
        ]);
        const pending = pendingRes.data.data || [];
        const accepted = acceptedRes.data.data || [];
        setPendingDonations(pending);
        setAcceptedDonations(accepted);

        const restored = {};
        accepted.forEach(d => {
          if (d.ngoLiveLocation?.lat) restored[d._id] = d.ngoLiveLocation;
          if (d.pickupStatus === "on_the_way") startLocationInterval(d._id);
        });
        setNgoLiveLocations(restored);
      } catch (err) { console.error("Fetch error:", err); }
    };

    fetchDonations();

    socket.on("connect", () => console.log("✅ NGO socket connected:", socket.id));

    socket.on("newDonation", (donation) => {
      setPendingDonations(prev =>
        prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
      );
    });

    socket.on("donationAccepted", (donation) => {
      setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
      const myId = userRef.current?._id || userRef.current?.id;
      const acceptedById = donation.acceptedBy?._id || donation.acceptedBy;
      if (String(acceptedById) === String(myId)) {
        setAcceptedDonations(prev =>
          prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
        );
      }
    });

    socket.on("donationCancelled", (donation) => {
      setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
      setPendingDonations(prev =>
        prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
      );
      if (locationIntervals.current[donation._id]) {
        clearInterval(locationIntervals.current[donation._id]);
      }
    });

    socket.on("pickupStarted", (donation) => {
      setAcceptedDonations(prev =>
        prev.map(d => d._id === donation._id ? { ...donation } : d)
      );
    });

    socket.on("pickupCompleted", (donation) => {
      setAcceptedDonations(prev =>
        prev.map(d => d._id === donation._id ? { ...donation } : d)
      );
      if (locationIntervals.current[donation._id]) {
        clearInterval(locationIntervals.current[donation._id]);
      }
    });

    return () => {
      socket.disconnect();
      Object.values(locationIntervals.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    acceptedDonations.forEach(d => {
      const ev = `ngoLocation_${d._id}`;
      socket.off(ev);
      if (d.pickupStatus === "otp_pending" || d.pickupStatus === "on_the_way") {
        socket.on(ev, loc => {
          setNgoLiveLocations(prev => ({ ...prev, [d._id]: loc }));
        });
      }
    });
  }, [acceptedDonations]);

  const handleAccept = (donation) => {
    setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
    setActiveTab("accepted");

    const doAccept = async (ngoLat, ngoLng) => {
      try {
        const res = await axios.put(
          `${API_URL}/donation/accept/${donation._id}`,
          { ngoLat: ngoLat || null, ngoLng: ngoLng || null },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setAcceptedDonations(prev =>
          prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
        );
        if (ngoLat && ngoLng) {
          setNgoLiveLocations(prev => ({ ...prev, [donation._id]: { lat: ngoLat, lng: ngoLng } }));
          startLocationInterval(donation._id);
        }
      } catch (err) {
        setPendingDonations(prev => [donation, ...prev]);
        setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
        alert("Failed: " + (err.response?.data?.error || err.message));
      }
    };

    if (!navigator.geolocation) { doAccept(null, null); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => doAccept(pos.coords.latitude, pos.coords.longitude),
      () => doAccept(null, null),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
    );
  };

  const handleCancel = async (donation) => {
    try {
      const res = await axios.put(
        `${API_URL}/donation/cancel/${donation._id}`, {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
      setPendingDonations(prev =>
        prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
      );
      if (locationIntervals.current[donation._id]) clearInterval(locationIntervals.current[donation._id]);
    } catch (err) { console.error("Cancel error:", err); }
  };

  const handleVerifyOtp = async (donation) => {
    const otp = otpInputs[donation._id];
    if (!otp || otp.length !== 4) {
      setOtpErrors(prev => ({ ...prev, [donation._id]: "4 digit OTP daalo!" }));
      return;
    }
    setOtpLoading(prev => ({ ...prev, [donation._id]: true }));
    setOtpErrors(prev => ({ ...prev, [donation._id]: "" }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await axios.put(
            `${API_URL}/donation/verify-otp/${donation._id}`,
            { otp, ngoLat: pos.coords.latitude, ngoLng: pos.coords.longitude },
            { headers: { Authorization: `Bearer ${getToken()}` } }
          );
          setAcceptedDonations(prev =>
            prev.map(d => d._id === donation._id ? { ...res.data.data } : d)
          );
          setOtpInputs(prev => ({ ...prev, [donation._id]: "" }));
        } catch (err) {
          setOtpErrors(prev => ({
            ...prev,
            [donation._id]: err.response?.data?.error || "OTP verify failed"
          }));
        } finally {
          setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
        }
      },
      () => {
        alert("Location allow karo!");
        setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCompletePickup = async (donation) => {
    try {
      const res = await axios.put(
        `${API_URL}/donation/complete-pickup/${donation._id}`, {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setAcceptedDonations(prev =>
        prev.map(d => d._id === donation._id ? { ...res.data.data } : d)
      );
      if (locationIntervals.current[donation._id]) clearInterval(locationIntervals.current[donation._id]);
    } catch (err) { console.error("Complete error:", err); }
  };

  const renderTrackingSection = (d) => {
    const ngoLoc = ngoLiveLocations[d._id] || d.ngoLiveLocation;

    if (d.pickupStatus === "otp_pending") {
      return (
        <div style={{ marginTop: 12 }}>
          <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
            <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>🚗 Donor ke paas jao — route dekho</p>
            <p style={{ color: "rgba(187,247,208,0.4)", fontSize: 12, margin: 0 }}>Pahuncho toh OTP maango</p>
          </div>
          <TrackingMap
            ngoLocation={ngoLoc}
            donorLocation={d.donorLocation}
            donorAddress={d.donorLocation?.address || d.location}
            isNgo={true}
            showRoute={true}
          />
          <div style={{ display: "flex", gap: 12, margin: "6px 0 10px", fontSize: 11, color: "rgba(187,247,208,0.4)" }}>
            <span>🟢 Aap (NGO)</span><span>🔴 Pickup point</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Donor ka OTP"
              value={otpInputs[d._id] || ""}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setOtpInputs(prev => ({ ...prev, [d._id]: val }));
                setOtpErrors(prev => ({ ...prev, [d._id]: "" }));
              }}
              style={{
                flex: 1, background: "rgba(255,255,255,0.07)",
                border: `1px solid ${otpErrors[d._id] ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.3)"}`,
                borderRadius: 10, padding: "10px", color: "#f0fdf4",
                fontSize: 22, fontWeight: 700, outline: "none",
                letterSpacing: "0.3em", textAlign: "center", fontFamily: "inherit",
                minWidth: 0,
              }}
            />
            <button
              onClick={() => handleVerifyOtp(d)}
              disabled={otpLoading[d._id] || otpInputs[d._id]?.length !== 4}
              style={{
                background: otpInputs[d._id]?.length === 4 ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "rgba(255,255,255,0.08)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "10px 14px", fontSize: 13, fontWeight: 600,
                cursor: otpInputs[d._id]?.length === 4 ? "pointer" : "not-allowed",
                fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {otpLoading[d._id] ? "⏳" : "✅ Verify"}
            </button>
          </div>
          {otpErrors[d._id] && (
            <div style={{ marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "8px 12px", color: "#fca5a5", fontSize: 13 }}>
              {otpErrors[d._id]}
            </div>
          )}
        </div>
      );
    }

    if (d.pickupStatus === "on_the_way") {
      return (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa", display: "inline-block", animation: "ngopulse 1.5s infinite" }} />
            <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 600 }}>✅ OTP Verified! Deliver karo</span>
          </div>
          <TrackingMap
            ngoLocation={ngoLoc}
            donorLocation={d.donorLocation}
            donorAddress={d.donorLocation?.address || d.location}
            isNgo={true}
            showRoute={true}
          />
          <div style={{ display: "flex", gap: 12, margin: "6px 0 10px", fontSize: 11, color: "rgba(187,247,208,0.4)" }}>
            <span>🟢 Aap (NGO)</span><span>🔴 Pickup point</span>
          </div>
          <button
            onClick={() => handleCompletePickup(d)}
            style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }}
          >
            ✅ Mark as Delivered
          </button>
        </div>
      );
    }

    if (d.pickupStatus === "completed" || d.status === "completed") {
      return (
        <div style={{ marginTop: 10, color: "#4ade80", fontWeight: 600, fontSize: 13, textAlign: "center", padding: "10px", background: "rgba(74,222,128,0.08)", borderRadius: 10, border: "1px solid rgba(74,222,128,0.2)" }}>
          🎉 Delivered Successfully!
        </div>
      );
    }
    return null;
  };

  const renderCard = (d, action, isPending) => (
    <div key={d._id} style={{
      background: "rgba(5,18,11,0.9)",
      border: `1px solid ${isPending ? "rgba(234,179,8,0.2)" : d.status === "completed" ? "rgba(96,165,250,0.2)" : "rgba(34,197,94,0.2)"}`,
      borderRadius: 16, padding: "14px", marginBottom: 12, position: "relative",
      /* Fix card overflow on mobile */
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isPending ? "linear-gradient(to bottom,#fbbf24,#f59e0b)" : d.status === "completed" ? "linear-gradient(to bottom,#60a5fa,#3b82f6)" : "linear-gradient(to bottom,#4ade80,#16a34a)", borderRadius: "16px 0 0 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, paddingLeft: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          {d.photo && (
            <img
              src={d.photo}
              alt={d.foodName}
              style={{
                width: isMobile ? 48 : 56,
                height: isMobile ? 48 : 56,
                objectFit: "cover",
                borderRadius: 10,
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: isMobile ? "0.82rem" : "0.9rem", color: "#f0fdf4", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.foodName}</p>
            {d.createdBy && (
              <p style={{ fontSize: 11, color: "rgba(187,247,208,0.8)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                👤 {d.createdBy.name}
              </p>
            )}
            <p style={{ fontSize: 11, color: "rgba(187,247,208,0.55)", margin: "0 0 2px" }}>🍴 {d.quantity}</p>
            <p style={{ fontSize: 11, color: "rgba(187,247,208,0.55)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {d.location}</p>
            <p style={{ fontSize: 10, color: "rgba(187,247,208,0.3)", margin: 0 }}>🕐 {formatDate(d.createdAt)} {formatTime(d.createdAt)}</p>
            {d.status === "completed" && (
              <span style={{ display: "inline-block", background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 600, marginTop: 3 }}>✅ Delivered</span>
            )}
          </div>
        </div>
        {/* Action button — stacked below on very small screens */}
        <div style={{ flexShrink: 0 }}>
          {isPending && action}
          {!isPending && d.status !== "completed" && action}
        </div>
      </div>
      {!isPending && renderTrackingSection(d)}
    </div>
  );

  const pendingCount = pendingDonations.length;
  const acceptedCount = acceptedDonations.filter(d => d.status === "accepted").length;
  const completedCount = acceptedDonations.filter(d => d.status === "completed").length;

  return (
    <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-5%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(22,163,74,0.12) 0%,transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(234,179,8,0.06) 0%,transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.025) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1100,
        margin: "0 auto",
        /* Mobile: snug horizontal padding, bottom space for nav */
        padding: isMobile ? "64px 12px 80px 12px" : "80px 28px 60px 110px",
      }}>

        {/* Header */}
        <div style={{ marginBottom: isMobile ? 14 : 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 8, fontSize: 11, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "ngopulse 2s infinite" }} />
            Live Dashboard
          </div>
          <h1 style={{ fontSize: isMobile ? "1.3rem" : "2.2rem", fontWeight: 800, color: "#f0fdf4", margin: "0 0 3px" }}>NGO Dashboard</h1>
          <p style={{ color: "rgba(187,247,208,0.45)", fontSize: isMobile ? "0.8rem" : "0.88rem", margin: 0 }}>
            Welcome, <span style={{ color: "#fff", fontWeight: 700 }}>{user?.name || "NGO"}</span>!
          </p>
        </div>

        {/* Stats row — compact on mobile */}
        <div style={{ display: "flex", gap: isMobile ? 6 : 8, marginBottom: isMobile ? 14 : 20 }}>
          {[
            { label: "Pending", count: pendingCount, color: "#fbbf24", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
            { label: "Active", count: acceptedCount, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
            { label: "Delivered", count: completedCount, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: isMobile ? "8px 10px" : "10px 14px", display: "flex", alignItems: "center", gap: isMobile ? 5 : 8, flex: 1 }}>
              <span style={{ fontSize: isMobile ? "1.1rem" : "1.3rem", fontWeight: 800, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: isMobile ? 11 : 12, color: "rgba(187,247,208,0.6)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tab switcher — always shown on mobile, hidden on desktop */}
        {isMobile && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[
              { key: "pending", label: `Pending (${pendingCount})`, activeColor: "#fbbf24", activeText: "#000" },
              { key: "accepted", label: `My Donations (${acceptedDonations.length})`, activeColor: "#4ade80", activeText: "#000" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
                fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: activeTab === tab.key ? tab.activeColor : "rgba(255,255,255,0.06)",
                color: activeTab === tab.key ? tab.activeText : "rgba(187,247,208,0.5)",
                transition: "all 0.2s",
                /* Prevent text overflow on small screens */
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, alignItems: "start" }}>

          {(!isMobile || activeTab === "pending") && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
                <h2 style={{ fontSize: isMobile ? "0.9rem" : "1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>Pending Donations</h2>
                <span style={{ marginLeft: "auto", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{pendingCount}</span>
              </div>
              {pendingDonations.length === 0
                ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 14, padding: "28px 16px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: 14 }}>No pending donations.</div>
                : pendingDonations.map(d => renderCard(d,
                    <button
                      onClick={() => handleAccept(d)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: "linear-gradient(135deg,#14532d,#16a34a)",
                        color: "#fff", border: "none", borderRadius: 10,
                        padding: isMobile ? "7px 10px" : "8px 12px",
                        fontSize: isMobile ? 12 : 13, fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap",
                        flexShrink: 0, fontFamily: "inherit",
                        /* Ensure tap target size */
                        minHeight: 36,
                      }}
                    >
                      <CheckCircle size={13} /> Accept
                    </button>, true))
              }
            </section>
          )}

          {(!isMobile || activeTab === "accepted") && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                <h2 style={{ fontSize: isMobile ? "0.9rem" : "1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>My Donations</h2>
                <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{acceptedDonations.length}</span>
              </div>
              {acceptedDonations.length === 0
                ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 14, padding: "28px 16px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: 14 }}>No donations yet.</div>
                : acceptedDonations.map(d => renderCard(d,
                    <button
                      onClick={() => handleCancel(d)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                        border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10,
                        padding: isMobile ? "7px 9px" : "8px 10px",
                        fontSize: isMobile ? 11 : 12, fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap",
                        flexShrink: 0, fontFamily: "inherit",
                        minHeight: 36,
                      }}
                    >
                      <XCircle size={13} /> Cancel
                    </button>, false))
              }
            </section>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ngopulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }

        /* Prevent horizontal scroll on mobile */
        body { overflow-x: hidden; }

        /* Remove number input arrows on mobile */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] { -moz-appearance: textfield; }

        /* Better tap targets */
        button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

        /* Safe area support for notched phones */
        @supports (padding: max(0px)) {
          .ngo-root-padding {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
            padding-bottom: max(80px, calc(env(safe-area-inset-bottom) + 80px));
          }
        }
      `}</style>
    </div>
  );
};

export default NgoDashboard;