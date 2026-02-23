// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import { CheckCircle, XCircle } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import TrackingMap from "../components/ui/TrackingMap";

// const API_URL = window.location.hostname === "localhost"
//   ? "http://localhost:5000/api"
//   : "https://foodsharebackendnew.onrender.com/api";

// const socket = io(window.location.hostname === "localhost"
//   ? "http://localhost:5000"
//   : "https://foodsharebackendnew.onrender.com");

// const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
// const formatTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

// const NgoDashboard = () => {
//   const { user, token } = useAuth();
//   const [pendingDonations, setPendingDonations] = useState([]);
//   const [acceptedDonations, setAcceptedDonations] = useState([]);
//   const [ngoLiveLocations, setNgoLiveLocations] = useState({});
//   const [otpInputs, setOtpInputs] = useState({});
//   const [otpErrors, setOtpErrors] = useState({});
//   const [otpLoading, setOtpLoading] = useState({});
//   const [loading, setLoading] = useState(true);
//   const locationIntervals = useRef({});

//   // ✅ Always fresh token milega
//   const getToken = useCallback(() => {
//     return token || localStorage.getItem("token");
//   }, [token]);

//   // ✅ useCallback — token change hone par naya function bane
//   const startLocationInterval = useCallback((donationId) => {
//     if (locationIntervals.current[donationId]) {
//       clearInterval(locationIntervals.current[donationId]);
//     }
//     const t = getToken();
//     locationIntervals.current[donationId] = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         async (p) => {
//           const lat = p.coords.latitude;
//           const lng = p.coords.longitude;

//           setNgoLiveLocations(prev => ({
//             ...prev,
//             [donationId]: { lat, lng }
//           }));

//           try {
//             await axios.put(
//               `${API_URL}/donation/update-location/${donationId}`,
//               { lat, lng },
//               { headers: { Authorization: `Bearer ${t}` } }
//             );
//           } catch (e) {
//             console.warn("Location update failed:", e);
//           }
//         },
//         (e) => console.warn("Geo error:", e),
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     }, 4000);
//   }, [getToken]);

//   // ✅ fetchDonations ko useCallback mein wrap kiya — reuse hoga
//   const fetchDonations = useCallback(async () => {
//     const t = getToken();
//     if (!t) return; // ← Token nahi hai toh fetch mat karo

//     setLoading(true);
//     try {
//       const [pendingRes, acceptedRes] = await Promise.all([
//         axios.get(`${API_URL}/donation/pending`, { headers: { Authorization: `Bearer ${t}` } }),
//         axios.get(`${API_URL}/donation/accepted`, { headers: { Authorization: `Bearer ${t}` } }),
//       ]);

//       const pending = pendingRes.data.data || [];
//       const accepted = acceptedRes.data.data || [];

//       setPendingDonations(pending);
//       setAcceptedDonations(accepted);

//       // ✅ Refresh/re-login pe location aur intervals restore karo
//       const restored = {};
//       accepted.forEach(d => {
//         if (d.ngoLiveLocation?.lat) {
//           restored[d._id] = d.ngoLiveLocation;
//         }
//         if (d.pickupStatus === "on_the_way" || d.pickupStatus === "otp_pending") {
//           startLocationInterval(d._id);
//         }
//       });
//       setNgoLiveLocations(restored);

//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, startLocationInterval]);

//   // ✅ token ya user change hone par (login/logout/refresh) data dobara fetch ho
//   useEffect(() => {
//     if (!token) {
//       // Token nahi — state clear karo (logout case)
//       setPendingDonations([]);
//       setAcceptedDonations([]);
//       setNgoLiveLocations({});
//       setLoading(false);
//       return;
//     }

//     fetchDonations();
//   }, [token, fetchDonations]);

//   // ✅ Socket events
//   useEffect(() => {
//     socket.on("newDonation", (donation) => {
//       setPendingDonations(prev =>
//         prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
//       );
//     });

//     socket.on("donationAccepted", (donation) => {
//       setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
//       const myId = user?._id || user?.id;
//       const acceptedById = donation.acceptedBy?._id || donation.acceptedBy;
//       if (String(acceptedById) === String(myId)) {
//         setAcceptedDonations(prev =>
//           prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
//         );
//       }
//     });

//     socket.on("donationCancelled", (donation) => {
//       setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
//       setPendingDonations(prev =>
//         prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//         delete locationIntervals.current[donation._id];
//       }
//     });

//     socket.on("pickupStarted", (donation) => {
//       setAcceptedDonations(prev =>
//         prev.map(d => d._id === donation._id ? donation : d)
//       );
//     });

//     socket.on("pickupCompleted", (donation) => {
//       setAcceptedDonations(prev =>
//         prev.map(d => d._id === donation._id ? donation : d)
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//         delete locationIntervals.current[donation._id];
//       }
//     });

//     return () => {
//       socket.off("newDonation");
//       socket.off("donationAccepted");
//       socket.off("donationCancelled");
//       socket.off("pickupStarted");
//       socket.off("pickupCompleted");
//     };
//   }, [user]);

//   useEffect(() => {
//     acceptedDonations.forEach(d => {
//       if (d.pickupStatus === "otp_pending" || d.pickupStatus === "on_the_way") {
//         socket.on(`ngoLocation_${d._id}`, loc => {
//           setNgoLiveLocations(prev => ({ ...prev, [d._id]: loc }));
//         });
//       }
//     });
//     return () => acceptedDonations.forEach(d => socket.off(`ngoLocation_${d._id}`));
//   }, [acceptedDonations]);

//   // ✅ Unmount pe sab intervals clear karo — memory leak band
//   useEffect(() => {
//     return () => {
//       Object.values(locationIntervals.current).forEach(clearInterval);
//       locationIntervals.current = {};
//     };
//   }, []);

//   const handleAccept = async (donation) => {
//     if (!navigator.geolocation) {
//       alert("Geolocation support nahi hai!");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const ngoLat = pos.coords.latitude;
//         const ngoLng = pos.coords.longitude;
//         try {
//           const res = await axios.put(
//             `${API_URL}/donation/accept/${donation._id}`,
//             { ngoLat, ngoLng },
//             { headers: { Authorization: `Bearer ${getToken()}` } }
//           );
//           setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
//           setAcceptedDonations(prev =>
//             prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
//           );

//           setNgoLiveLocations(prev => ({
//             ...prev,
//             [donation._id]: { lat: ngoLat, lng: ngoLng }
//           }));

//           startLocationInterval(donation._id);

//         } catch (err) {
//           alert("Failed: " + (err.response?.data?.error || err.message));
//         }
//       },
//       () => alert("Location allow karo browser mein!"),
//       { enableHighAccuracy: true, timeout: 15000 }
//     );
//   };

//   const handleCancel = async (donation) => {
//     try {
//       const res = await axios.put(
//         `${API_URL}/donation/cancel/${donation._id}`, {},
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
//       setPendingDonations(prev =>
//         prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//         delete locationIntervals.current[donation._id];
//       }
//     } catch (err) {
//       console.error("Cancel error:", err);
//     }
//   };

//   const handleVerifyOtp = async (donation) => {
//     const otp = otpInputs[donation._id];
//     if (!otp || otp.length !== 4) {
//       setOtpErrors(prev => ({ ...prev, [donation._id]: "4 digit OTP daalo!" }));
//       return;
//     }
//     setOtpLoading(prev => ({ ...prev, [donation._id]: true }));
//     setOtpErrors(prev => ({ ...prev, [donation._id]: "" }));

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const ngoLat = pos.coords.latitude;
//         const ngoLng = pos.coords.longitude;
//         try {
//           const res = await axios.put(
//             `${API_URL}/donation/verify-otp/${donation._id}`,
//             { otp, ngoLat, ngoLng },
//             { headers: { Authorization: `Bearer ${getToken()}` } }
//           );
//           setAcceptedDonations(prev =>
//             prev.map(d => d._id === donation._id ? res.data.data : d)
//           );
//           setOtpInputs(prev => ({ ...prev, [donation._id]: "" }));
//         } catch (err) {
//           setOtpErrors(prev => ({
//             ...prev,
//             [donation._id]: err.response?.data?.error || "OTP verify failed"
//           }));
//         } finally {
//           setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
//         }
//       },
//       () => {
//         alert("Location allow karo!");
//         setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
//       },
//       { enableHighAccuracy: true, timeout: 15000 }
//     );
//   };

//   const handleCompletePickup = async (donation) => {
//     try {
//       const res = await axios.put(
//         `${API_URL}/donation/complete-pickup/${donation._id}`, {},
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       setAcceptedDonations(prev =>
//         prev.map(d => d._id === donation._id ? res.data.data : d)
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//         delete locationIntervals.current[donation._id];
//       }
//     } catch (err) {
//       console.error("Complete error:", err);
//     }
//   };

//   const renderTrackingSection = (d) => {
//     const ngoLoc = ngoLiveLocations[d._id] || d.ngoLiveLocation;

//     if (d.pickupStatus === "otp_pending") {
//       return (
//         <div style={{ paddingLeft: 8, marginTop: 14 }}>
//           <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 10 }}>
//             <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>
//               🚗 Route dekho — donor ke paas jao
//             </p>
//             <p style={{ color: "rgba(187,247,208,0.4)", fontSize: 12, margin: 0 }}>
//               Pahuncho toh donor se OTP maango
//             </p>
//           </div>

//           <TrackingMap
//             ngoLocation={ngoLoc}
//             donorLocation={d.donorLocation}
//             donorAddress={d.donorLocation?.address || d.location}
//             isNgo={true}
//             showRoute={true}
//           />
//           <div style={{ display: "flex", gap: 16, marginTop: 6, marginBottom: 12, fontSize: 12, color: "rgba(187,247,208,0.4)" }}>
//             <span>🟢 Aap (NGO)</span>
//             <span>🔴 Donor ka pickup point</span>
//           </div>

//           <p style={{ color: "rgba(187,247,208,0.6)", fontSize: 12, margin: "0 0 8px" }}>
//             Donor ke paas pahunch gaye? Unka OTP lo:
//           </p>
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               type="number"
//               placeholder="Donor ka OTP"
//               value={otpInputs[d._id] || ""}
//               onChange={e => {
//                 const val = e.target.value.replace(/\D/g, "").slice(0, 4);
//                 setOtpInputs(prev => ({ ...prev, [d._id]: val }));
//                 setOtpErrors(prev => ({ ...prev, [d._id]: "" }));
//               }}
//               style={{
//                 flex: 1, background: "rgba(255,255,255,0.07)",
//                 border: `1px solid ${otpErrors[d._id] ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.3)"}`,
//                 borderRadius: 10, padding: "10px 14px",
//                 color: "#f0fdf4", fontSize: 22, fontWeight: 700,
//                 outline: "none", letterSpacing: "0.3em",
//                 textAlign: "center", fontFamily: "inherit"
//               }}
//             />
//             <button
//               onClick={() => handleVerifyOtp(d)}
//               disabled={otpLoading[d._id] || !otpInputs[d._id] || otpInputs[d._id].length !== 4}
//               style={{
//                 background: otpInputs[d._id]?.length === 4
//                   ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
//                   : "rgba(255,255,255,0.1)",
//                 color: "#fff", border: "none", borderRadius: 10,
//                 padding: "10px 20px", fontSize: 13, fontWeight: 600,
//                 cursor: otpInputs[d._id]?.length === 4 ? "pointer" : "not-allowed",
//                 fontFamily: "inherit"
//               }}
//             >
//               {otpLoading[d._id] ? "⏳" : "✅ Verify"}
//             </button>
//           </div>
//           {otpErrors[d._id] && (
//             <div style={{ marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "8px 12px", color: "#fca5a5", fontSize: 13 }}>
//               {otpErrors[d._id]}
//             </div>
//           )}
//         </div>
//       );
//     }

//     if (d.pickupStatus === "on_the_way") {
//       return (
//         <div style={{ paddingLeft: 8, marginTop: 14 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
//             <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa", display: "inline-block", animation: "pulse 1.5s infinite" }} />
//             <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 600 }}>✅ OTP Verified! Food le ke deliver karo</span>
//           </div>

//           <TrackingMap
//             ngoLocation={ngoLoc}
//             donorLocation={d.donorLocation}
//             donorAddress={d.donorLocation?.address || d.location}
//             isNgo={true}
//             showRoute={true}
//           />
//           <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 12, color: "rgba(187,247,208,0.4)" }}>
//             <span>🟢 Aap (NGO)</span>
//             <span>🔴 Donor ka pickup point</span>
//           </div>

//           <button
//             onClick={() => handleCompletePickup(d)}
//             style={{ marginTop: 10, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }}
//           >
//             ✅ Mark as Delivered
//           </button>
//         </div>
//       );
//     }

//     if (d.pickupStatus === "completed") {
//       return (
//         <div style={{ paddingLeft: 8, marginTop: 14 }}>
//           <div style={{ color: "#4ade80", fontWeight: 600, fontSize: 13, textAlign: "center", padding: "10px", background: "rgba(74,222,128,0.08)", borderRadius: 10, border: "1px solid rgba(74,222,128,0.2)" }}>
//             🎉 Delivered Successfully!
//           </div>
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderCard = (d, action, isPending) => (
//     <div key={d._id} style={{ background: "rgba(5,18,11,0.85)", border: `1px solid ${isPending ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)"}`, borderRadius: 16, padding: "16px 20px", marginBottom: 12, backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isPending ? "linear-gradient(to bottom, #fbbf24, #f59e0b)" : "linear-gradient(to bottom, #4ade80, #16a34a)", borderRadius: "16px 0 0 16px" }} />
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 8, flex: 1 }}>
//           {d.photo && (
//             <img src={d.photo} alt={d.foodName} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
//           )}
//           <div>
//             <p style={{ fontWeight: 700, fontSize: "1rem", color: "#f0fdf4", margin: "0 0 5px" }}>{d.foodName}</p>
//             {d.createdBy && (
//               <p style={{ fontSize: 13, color: "rgba(187,247,208,0.85)", margin: "0 0 4px" }}>
//                 👤 {d.createdBy.name} — {d.createdBy.email}
//               </p>
//             )}
//             <p style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", margin: "0 0 3px" }}>🍴 {d.quantity}</p>
//             <p style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", margin: "0 0 3px" }}>📍 {d.location}</p>
//             {!isPending && d.acceptedBy && (
//               <p style={{ fontSize: 13, color: "#4ade80", margin: "0 0 4px" }}>🏢 {d.acceptedBy?.name}</p>
//             )}
//             <p style={{ fontSize: 12, color: "rgba(187,247,208,0.3)", margin: 0 }}>
//               🕐 {formatDate(d.createdAt)} {formatTime(d.createdAt)}
//             </p>
//           </div>
//         </div>
//         {action}
//       </div>
//       {!isPending && renderTrackingSection(d)}
//     </div>
//   );

//   // ✅ Loading UI
//   const renderLoadingState = () => (
//     <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
//       <div style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "rgba(187,247,208,0.5)", fontSize: 14 }}>
//         <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 1s infinite" }} />
//         Loading donations...
//       </div>
//     </div>
//   );

//   return (
//     <div className="ngo-root" style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
//         <div style={{ position: "absolute", top: "-5%", left: "20%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
//         <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
//       </div>

//       <div className="ngo-inner" style={{ position: "relative", zIndex: 1 }}>
//         <div style={{ marginBottom: 40 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 16, fontSize: 12, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
//             Live Dashboard
//           </div>
//           <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#f0fdf4", margin: 0 }}>
//             NGO Dashboard
//           </h1>
//           <p style={{ color: "rgba(187,247,208,0.45)", marginTop: 8, fontSize: "0.95rem" }}>
//             Welcome, <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.5rem" }}>{user?.name || "NGO"}</span>!
//           </p>
//         </div>

//         <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
//           {[
//             { label: "Pending", count: pendingDonations.length, color: "#fbbf24", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
//             { label: "My Accepted", count: acceptedDonations.length, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
//             { label: "Total", count: pendingDonations.length + acceptedDonations.length, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
//           ].map((s, i) => (
//             <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
//               <span style={{ fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.count}</span>
//               <span style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", fontWeight: 500 }}>{s.label}</span>
//             </div>
//           ))}
//         </div>

//         <div className="ngo-grid">
//           <section>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
//               <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>Pending Donations</h2>
//               <span style={{ marginLeft: "auto", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
//                 {pendingDonations.length}
//               </span>
//             </div>
//             {loading
//               ? renderLoadingState()
//               : pendingDonations.length === 0
//                 ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center", color: "rgba(187,247,208,0.3)" }}>No pending donations.</div>
//                 : pendingDonations.map(d => renderCard(d,
//                     <button
//                       onClick={() => handleAccept(d)}
//                       style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}
//                     >
//                       <CheckCircle size={15} /> Accept
//                     </button>, true))
//             }
//           </section>

//           <section>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
//               <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>My Accepted Donations</h2>
//               <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
//                 {acceptedDonations.length}
//               </span>
//             </div>
//             {loading
//               ? renderLoadingState()
//               : acceptedDonations.length === 0
//                 ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center", color: "rgba(187,247,208,0.3)" }}>No accepted donations yet.</div>
//                 : acceptedDonations.map(d => renderCard(d,
//                     <button
//                       onClick={() => handleCancel(d)}
//                       style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}
//                       onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
//                       onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
//                     >
//                       <XCircle size={15} /> Cancel
//                     </button>, false))
//             }
//           </section>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
//         * { box-sizing: border-box; }
//         .ngo-root { padding: 80px 28px 60px 110px; }
//         .ngo-inner { max-width: 1100px; margin: 0 auto; }
//         .ngo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
//         @media (max-width: 768px) {
//           .ngo-root { padding: 72px 14px 48px 14px !important; }
//           .ngo-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NgoDashboard; 

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import { CheckCircle, XCircle } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import TrackingMap from "../components/ui/TrackingMap";

// const API_URL = window.location.hostname === "localhost"
//   ? "http://localhost:5000/api"
//   : "https://foodsharebackendnew.onrender.com/api";

// const socket = io(window.location.hostname === "localhost"
//   ? "http://localhost:5000"
//   : "https://foodsharebackendnew.onrender.com");

// const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
// const formatTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

// const NgoDashboard = () => {
//   const { user, token } = useAuth();
//   const [pendingDonations, setPendingDonations] = useState([]);
//   const [acceptedDonations, setAcceptedDonations] = useState([]);
//   const [ngoLiveLocations, setNgoLiveLocations] = useState({});
//   const [otpInputs, setOtpInputs] = useState({});
//   const [otpErrors, setOtpErrors] = useState({});
//   const [otpLoading, setOtpLoading] = useState({});
//   const locationIntervals = useRef({});

//   const getToken = () => token || localStorage.getItem("token");

//   // ✅ useEffect ke BAHAR — sab functions access kar sakein
//   const startLocationInterval = (donationId) => {
//     if (locationIntervals.current[donationId]) {
//       clearInterval(locationIntervals.current[donationId]);
//     }
//     const t = getToken();
//     locationIntervals.current[donationId] = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         async (p) => {
//           const lat = p.coords.latitude;
//           const lng = p.coords.longitude;

//           // ✅ Real location — koi offset nahi
//           setNgoLiveLocations(prev => ({
//             ...prev,
//             [donationId]: { lat, lng }
//           }));

//           try {
//             await axios.put(
//               `${API_URL}/donation/update-location/${donationId}`,
//               { lat, lng },
//               { headers: { Authorization: `Bearer ${t}` } }
//             );
//           } catch (e) {
//             console.warn("Location update failed:", e);
//           }
//         },
//         (e) => console.warn("Geo error:", e),
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     }, 4000);
//   };

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const t = getToken();
//         const [pendingRes, acceptedRes] = await Promise.all([
//           axios.get(`${API_URL}/donation/pending`, { headers: { Authorization: `Bearer ${t}` } }),
//           axios.get(`${API_URL}/donation/accepted`, { headers: { Authorization: `Bearer ${t}` } }),
//         ]);

//         const pending = pendingRes.data.data || [];
//         const accepted = acceptedRes.data.data || [];

//         setPendingDonations(pending);
//         setAcceptedDonations(accepted);

//         // ✅ Refresh pe sab restore karo
//         const restored = {};
//         accepted.forEach(d => {
//           if (d.ngoLiveLocation?.lat) {
//             restored[d._id] = d.ngoLiveLocation;
//           }
//           // on_the_way donations ke liye interval restart
//           if (d.pickupStatus === "on_the_way") {
//             startLocationInterval(d._id);
//           }
//         });
//         setNgoLiveLocations(restored);

//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };

//     fetchDonations();

//     socket.on("newDonation", (donation) => {
//       setPendingDonations(prev =>
//         prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
//       );
//     });

//     socket.on("donationAccepted", (donation) => {
//       setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
//       const myId = user?._id || user?.id;
//       const acceptedById = donation.acceptedBy?._id || donation.acceptedBy;
//       if (String(acceptedById) === String(myId)) {
//         setAcceptedDonations(prev =>
//           prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
//         );
//       }
//     });

//     socket.on("donationCancelled", (donation) => {
//       setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
//       setPendingDonations(prev =>
//         prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//       }
//     });

//     socket.on("pickupStarted", (donation) => {
//       setAcceptedDonations(prev =>
//         prev.map(d => d._id === donation._id ? donation : d)
//       );
//     });

//     socket.on("pickupCompleted", (donation) => {
//       setAcceptedDonations(prev =>
//         prev.map(d => d._id === donation._id ? donation : d)
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//       }
//     });

//     return () => {
//       socket.off("newDonation");
//       socket.off("donationAccepted");
//       socket.off("donationCancelled");
//       socket.off("pickupStarted");
//       socket.off("pickupCompleted");
//     };
//   }, [token, user]);

//   useEffect(() => {
//     acceptedDonations.forEach(d => {
//       if (d.pickupStatus === "otp_pending" || d.pickupStatus === "on_the_way") {
//         socket.on(`ngoLocation_${d._id}`, loc => {
//           setNgoLiveLocations(prev => ({ ...prev, [d._id]: loc }));
//         });
//       }
//     });
//     return () => acceptedDonations.forEach(d => socket.off(`ngoLocation_${d._id}`));
//   }, [acceptedDonations]);

//   const handleAccept = async (donation) => {
//     if (!navigator.geolocation) {
//       alert("Geolocation support nahi hai!");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const ngoLat = pos.coords.latitude;
//         const ngoLng = pos.coords.longitude;
//         try {
//           const res = await axios.put(
//             `${API_URL}/donation/accept/${donation._id}`,
//             { ngoLat, ngoLng },
//             { headers: { Authorization: `Bearer ${getToken()}` } }
//           );
//           setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
//           setAcceptedDonations(prev =>
//             prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
//           );

//           // ✅ Real location — offset nahi
//           setNgoLiveLocations(prev => ({
//             ...prev,
//             [donation._id]: { lat: ngoLat, lng: ngoLng }
//           }));

//           // Accept ke baad se location update shuru — donor ko route dikhe
//           startLocationInterval(donation._id);

//         } catch (err) {
//           alert("Failed: " + (err.response?.data?.error || err.message));
//         }
//       },
//       () => alert("Location allow karo browser mein!"),
//       { enableHighAccuracy: true, timeout: 15000 }
//     );
//   };

//   const handleCancel = async (donation) => {
//     try {
//       const res = await axios.put(
//         `${API_URL}/donation/cancel/${donation._id}`, {},
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
//       setPendingDonations(prev =>
//         prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//       }
//     } catch (err) {
//       console.error("Cancel error:", err);
//     }
//   };

//   const handleVerifyOtp = async (donation) => {
//     const otp = otpInputs[donation._id];
//     if (!otp || otp.length !== 4) {
//       setOtpErrors(prev => ({ ...prev, [donation._id]: "4 digit OTP daalo!" }));
//       return;
//     }
//     setOtpLoading(prev => ({ ...prev, [donation._id]: true }));
//     setOtpErrors(prev => ({ ...prev, [donation._id]: "" }));

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const ngoLat = pos.coords.latitude;
//         const ngoLng = pos.coords.longitude;
//         try {
//           const res = await axios.put(
//             `${API_URL}/donation/verify-otp/${donation._id}`,
//             { otp, ngoLat, ngoLng },
//             { headers: { Authorization: `Bearer ${getToken()}` } }
//           );
//           setAcceptedDonations(prev =>
//             prev.map(d => d._id === donation._id ? res.data.data : d)
//           );
//           setOtpInputs(prev => ({ ...prev, [donation._id]: "" }));
//           // Interval already chal raha hai accept se — bas continue
//         } catch (err) {
//           setOtpErrors(prev => ({
//             ...prev,
//             [donation._id]: err.response?.data?.error || "OTP verify failed"
//           }));
//         } finally {
//           setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
//         }
//       },
//       () => {
//         alert("Location allow karo!");
//         setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
//       },
//       { enableHighAccuracy: true, timeout: 15000 }
//     );
//   };

//   const handleCompletePickup = async (donation) => {
//     try {
//       const res = await axios.put(
//         `${API_URL}/donation/complete-pickup/${donation._id}`, {},
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       setAcceptedDonations(prev =>
//         prev.map(d => d._id === donation._id ? res.data.data : d)
//       );
//       if (locationIntervals.current[donation._id]) {
//         clearInterval(locationIntervals.current[donation._id]);
//       }
//     } catch (err) {
//       console.error("Complete error:", err);
//     }
//   };

//   const renderTrackingSection = (d) => {
//     const ngoLoc = ngoLiveLocations[d._id] || d.ngoLiveLocation;

//     if (d.pickupStatus === "otp_pending") {
//       return (
//         <div style={{ paddingLeft: 8, marginTop: 14 }}>
//           <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 10 }}>
//             <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>
//               🚗 Route dekho — donor ke paas jao
//             </p>
//             <p style={{ color: "rgba(187,247,208,0.4)", fontSize: 12, margin: 0 }}>
//               Pahuncho toh donor se OTP maango
//             </p>
//           </div>

//           <TrackingMap
//             ngoLocation={ngoLoc}
//             donorLocation={d.donorLocation}
//             donorAddress={d.donorLocation?.address || d.location}
//             isNgo={true}
//             showRoute={true}
//           />
//           <div style={{ display: "flex", gap: 16, marginTop: 6, marginBottom: 12, fontSize: 12, color: "rgba(187,247,208,0.4)" }}>
//             <span>🟢 Aap (NGO)</span>
//             <span>🔴 Donor ka pickup point</span>
//           </div>

//           <p style={{ color: "rgba(187,247,208,0.6)", fontSize: 12, margin: "0 0 8px" }}>
//             Donor ke paas pahunch gaye? Unka OTP lo:
//           </p>
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               type="number"
//               placeholder="Donor ka OTP"
//               value={otpInputs[d._id] || ""}
//               onChange={e => {
//                 const val = e.target.value.replace(/\D/g, "").slice(0, 4);
//                 setOtpInputs(prev => ({ ...prev, [d._id]: val }));
//                 setOtpErrors(prev => ({ ...prev, [d._id]: "" }));
//               }}
//               style={{
//                 flex: 1, background: "rgba(255,255,255,0.07)",
//                 border: `1px solid ${otpErrors[d._id] ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.3)"}`,
//                 borderRadius: 10, padding: "10px 14px",
//                 color: "#f0fdf4", fontSize: 22, fontWeight: 700,
//                 outline: "none", letterSpacing: "0.3em",
//                 textAlign: "center", fontFamily: "inherit"
//               }}
//             />
//             <button
//               onClick={() => handleVerifyOtp(d)}
//               disabled={otpLoading[d._id] || !otpInputs[d._id] || otpInputs[d._id].length !== 4}
//               style={{
//                 background: otpInputs[d._id]?.length === 4
//                   ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
//                   : "rgba(255,255,255,0.1)",
//                 color: "#fff", border: "none", borderRadius: 10,
//                 padding: "10px 20px", fontSize: 13, fontWeight: 600,
//                 cursor: otpInputs[d._id]?.length === 4 ? "pointer" : "not-allowed",
//                 fontFamily: "inherit"
//               }}
//             >
//               {otpLoading[d._id] ? "⏳" : "✅ Verify"}
//             </button>
//           </div>
//           {otpErrors[d._id] && (
//             <div style={{ marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "8px 12px", color: "#fca5a5", fontSize: 13 }}>
//               {otpErrors[d._id]}
//             </div>
//           )}
//         </div>
//       );
//     }

//     if (d.pickupStatus === "on_the_way") {
//       return (
//         <div style={{ paddingLeft: 8, marginTop: 14 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
//             <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa", display: "inline-block", animation: "pulse 1.5s infinite" }} />
//             <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 600 }}>✅ OTP Verified! Food le ke deliver karo</span>
//           </div>

//           <TrackingMap
//             ngoLocation={ngoLoc}
//             donorLocation={d.donorLocation}
//             donorAddress={d.donorLocation?.address || d.location}
//             isNgo={true}
//             showRoute={true}
//           />
//           <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 12, color: "rgba(187,247,208,0.4)" }}>
//             <span>🟢 Aap (NGO)</span>
//             <span>🔴 Donor ka pickup point</span>
//           </div>

//           <button
//             onClick={() => handleCompletePickup(d)}
//             style={{ marginTop: 10, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }}
//           >
//             ✅ Mark as Delivered
//           </button>
//         </div>
//       );
//     }

//     if (d.pickupStatus === "completed") {
//       return (
//         <div style={{ paddingLeft: 8, marginTop: 14 }}>
//           <div style={{ color: "#4ade80", fontWeight: 600, fontSize: 13, textAlign: "center", padding: "10px", background: "rgba(74,222,128,0.08)", borderRadius: 10, border: "1px solid rgba(74,222,128,0.2)" }}>
//             🎉 Delivered Successfully!
//           </div>
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderCard = (d, action, isPending) => (
//     <div key={d._id} style={{ background: "rgba(5,18,11,0.85)", border: `1px solid ${isPending ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)"}`, borderRadius: 16, padding: "16px 20px", marginBottom: 12, backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isPending ? "linear-gradient(to bottom, #fbbf24, #f59e0b)" : "linear-gradient(to bottom, #4ade80, #16a34a)", borderRadius: "16px 0 0 16px" }} />
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 8, flex: 1 }}>
//           {d.photo && (
//             <img src={d.photo} alt={d.foodName} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
//           )}
//           <div>
//             <p style={{ fontWeight: 700, fontSize: "1rem", color: "#f0fdf4", margin: "0 0 5px" }}>{d.foodName}</p>
//             {d.createdBy && (
//               <p style={{ fontSize: 13, color: "rgba(187,247,208,0.85)", margin: "0 0 4px" }}>
//                 👤 {d.createdBy.name} — {d.createdBy.email}
//               </p>
//             )}
//             <p style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", margin: "0 0 3px" }}>🍴 {d.quantity}</p>
//             <p style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", margin: "0 0 3px" }}>📍 {d.location}</p>
//             {!isPending && d.acceptedBy && (
//               <p style={{ fontSize: 13, color: "#4ade80", margin: "0 0 4px" }}>🏢 {d.acceptedBy?.name}</p>
//             )}
//             <p style={{ fontSize: 12, color: "rgba(187,247,208,0.3)", margin: 0 }}>
//               🕐 {formatDate(d.createdAt)} {formatTime(d.createdAt)}
//             </p>
//           </div>
//         </div>
//         {action}
//       </div>
//       {!isPending && renderTrackingSection(d)}
//     </div>
//   );

//   return (
//     <div className="ngo-root" style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
//         <div style={{ position: "absolute", top: "-5%", left: "20%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
//         <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
//       </div>

//       <div className="ngo-inner" style={{ position: "relative", zIndex: 1 }}>
//         <div style={{ marginBottom: 40 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 16, fontSize: 12, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
//             Live Dashboard
//           </div>
//           <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#f0fdf4", margin: 0 }}>
//             NGO Dashboard
//           </h1>
//           <p style={{ color: "rgba(187,247,208,0.45)", marginTop: 8, fontSize: "0.95rem" }}>
//             Welcome, <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.5rem" }}>{user?.name || "NGO"}</span>!
//           </p>
//         </div>

//         <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
//           {[
//             { label: "Pending", count: pendingDonations.length, color: "#fbbf24", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
//             { label: "My Accepted", count: acceptedDonations.length, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
//             { label: "Total", count: pendingDonations.length + acceptedDonations.length, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
//           ].map((s, i) => (
//             <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
//               <span style={{ fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.count}</span>
//               <span style={{ fontSize: 13, color: "rgba(187,247,208,0.6)", fontWeight: 500 }}>{s.label}</span>
//             </div>
//           ))}
//         </div>

//         <div className="ngo-grid">
//           <section>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
//               <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>Pending Donations</h2>
//               <span style={{ marginLeft: "auto", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
//                 {pendingDonations.length}
//               </span>
//             </div>
//             {pendingDonations.length === 0
//               ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center", color: "rgba(187,247,208,0.3)" }}>No pending donations.</div>
//               : pendingDonations.map(d => renderCard(d,
//                   <button
//                     onClick={() => handleAccept(d)}
//                     style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}
//                   >
//                     <CheckCircle size={15} /> Accept
//                   </button>, true))
//             }
//           </section>

//           <section>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
//               <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>My Accepted Donations</h2>
//               <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
//                 {acceptedDonations.length}
//               </span>
//             </div>
//             {acceptedDonations.length === 0
//               ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center", color: "rgba(187,247,208,0.3)" }}>No accepted donations yet.</div>
//               : acceptedDonations.map(d => renderCard(d,
//                   <button
//                     onClick={() => handleCancel(d)}
//                     style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}
//                     onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
//                   >
//                     <XCircle size={15} /> Cancel
//                   </button>, false))
//             }
//           </section>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
//         * { box-sizing: border-box; }
//         .ngo-root { padding: 80px 28px 60px 110px; }
//         .ngo-inner { max-width: 1100px; margin: 0 auto; }
//         .ngo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
//         @media (max-width: 768px) {
//           .ngo-root { padding: 72px 14px 48px 14px !important; }
//           .ngo-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NgoDashboard; 


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import { CheckCircle, XCircle } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import TrackingMap from "../components/ui/TrackingMap";

// const API_URL = window.location.hostname === "localhost"
//   ? "http://localhost:5000/api"
//   : "https://foodsharebackendnew.onrender.com/api";

// const socket = io(window.location.hostname === "localhost"
//   ? "http://localhost:5000"
//   : "https://foodsharebackendnew.onrender.com");

// const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
// const formatTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

// const NgoDashboard = () => {
//   const { user, token } = useAuth();
//   const [pendingDonations, setPendingDonations] = useState([]);
//   const [acceptedDonations, setAcceptedDonations] = useState([]);
//   const [ngoLiveLocations, setNgoLiveLocations] = useState({});
//   const [otpInputs, setOtpInputs] = useState({});
//   const [otpErrors, setOtpErrors] = useState({});
//   const [otpLoading, setOtpLoading] = useState({});
//   const [activeTab, setActiveTab] = useState("pending"); // mobile tabs
//   const locationIntervals = useRef({});

//   const getToken = () => token || localStorage.getItem("token");

//   const startLocationInterval = (donationId) => {
//     if (locationIntervals.current[donationId]) {
//       clearInterval(locationIntervals.current[donationId]);
//     }
//     const t = getToken();
//     locationIntervals.current[donationId] = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         async (p) => {
//           const lat = p.coords.latitude;
//           const lng = p.coords.longitude;
//           setNgoLiveLocations(prev => ({ ...prev, [donationId]: { lat, lng } }));
//           try {
//             await axios.put(
//               `${API_URL}/donation/update-location/${donationId}`,
//               { lat, lng },
//               { headers: { Authorization: `Bearer ${t}` } }
//             );
//           } catch (e) { console.warn("Location update failed:", e); }
//         },
//         (e) => console.warn("Geo error:", e),
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     }, 4000);
//   };

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const t = getToken();
//         const [pendingRes, acceptedRes] = await Promise.all([
//           axios.get(`${API_URL}/donation/pending`, { headers: { Authorization: `Bearer ${t}` } }),
//           axios.get(`${API_URL}/donation/accepted`, { headers: { Authorization: `Bearer ${t}` } }),
//         ]);

//         const pending = pendingRes.data.data || [];
//         const accepted = acceptedRes.data.data || [];

//         setPendingDonations(pending);
//         setAcceptedDonations(accepted);

//         // ✅ Restore locations + restart intervals
//         const restored = {};
//         accepted.forEach(d => {
//           if (d.ngoLiveLocation?.lat) restored[d._id] = d.ngoLiveLocation;
//           if (d.pickupStatus === "on_the_way") startLocationInterval(d._id);
//         });
//         setNgoLiveLocations(restored);

//       } catch (err) { console.error("Fetch error:", err); }
//     };

//     fetchDonations();

//     socket.on("newDonation", (donation) => {
//       setPendingDonations(prev => prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]);
//     });

//     socket.on("donationAccepted", (donation) => {
//       setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
//       const myId = user?._id || user?.id;
//       const acceptedById = donation.acceptedBy?._id || donation.acceptedBy;
//       if (String(acceptedById) === String(myId)) {
//         setAcceptedDonations(prev => prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]);
//       }
//     });

//     socket.on("donationCancelled", (donation) => {
//       setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
//       setPendingDonations(prev => prev.find(d => d._id === donation._id) ? prev : [donation, ...prev]);
//       if (locationIntervals.current[donation._id]) clearInterval(locationIntervals.current[donation._id]);
//     });

//     socket.on("pickupStarted", (donation) => {
//       setAcceptedDonations(prev => prev.map(d => d._id === donation._id ? donation : d));
//     });

//     socket.on("pickupCompleted", (donation) => {
//       setAcceptedDonations(prev => prev.map(d => d._id === donation._id ? donation : d));
//       if (locationIntervals.current[donation._id]) clearInterval(locationIntervals.current[donation._id]);
//     });

//     return () => {
//       socket.off("newDonation");
//       socket.off("donationAccepted");
//       socket.off("donationCancelled");
//       socket.off("pickupStarted");
//       socket.off("pickupCompleted");
//     };
//   }, [token, user]);

//   useEffect(() => {
//     acceptedDonations.forEach(d => {
//       if (d.pickupStatus === "otp_pending" || d.pickupStatus === "on_the_way") {
//         socket.on(`ngoLocation_${d._id}`, loc => {
//           setNgoLiveLocations(prev => ({ ...prev, [d._id]: loc }));
//         });
//       }
//     });
//     return () => acceptedDonations.forEach(d => socket.off(`ngoLocation_${d._id}`));
//   }, [acceptedDonations]);

//   const handleAccept = async (donation) => {
//     if (!navigator.geolocation) { alert("Geolocation support nahi hai!"); return; }
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const ngoLat = pos.coords.latitude;
//         const ngoLng = pos.coords.longitude;
//         try {
//           const res = await axios.put(
//             `${API_URL}/donation/accept/${donation._id}`,
//             { ngoLat, ngoLng },
//             { headers: { Authorization: `Bearer ${getToken()}` } }
//           );
//           setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
//           setAcceptedDonations(prev => prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]);
//           setNgoLiveLocations(prev => ({ ...prev, [donation._id]: { lat: ngoLat, lng: ngoLng } }));
//           startLocationInterval(donation._id);
//           setActiveTab("accepted"); // mobile pe accepted tab pe le jao
//         } catch (err) { alert("Failed: " + (err.response?.data?.error || err.message)); }
//       },
//       () => alert("Location allow karo browser mein!"),
//       { enableHighAccuracy: true, timeout: 15000 }
//     );
//   };

//   const handleCancel = async (donation) => {
//     try {
//       const res = await axios.put(`${API_URL}/donation/cancel/${donation._id}`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
//       setAcceptedDonations(prev => prev.filter(d => d._id !== donation._id));
//       setPendingDonations(prev => prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]);
//       if (locationIntervals.current[donation._id]) clearInterval(locationIntervals.current[donation._id]);
//     } catch (err) { console.error("Cancel error:", err); }
//   };

//   const handleVerifyOtp = async (donation) => {
//     const otp = otpInputs[donation._id];
//     if (!otp || otp.length !== 4) {
//       setOtpErrors(prev => ({ ...prev, [donation._id]: "4 digit OTP daalo!" })); return;
//     }
//     setOtpLoading(prev => ({ ...prev, [donation._id]: true }));
//     setOtpErrors(prev => ({ ...prev, [donation._id]: "" }));
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         try {
//           const res = await axios.put(
//             `${API_URL}/donation/verify-otp/${donation._id}`,
//             { otp, ngoLat: pos.coords.latitude, ngoLng: pos.coords.longitude },
//             { headers: { Authorization: `Bearer ${getToken()}` } }
//           );
//           setAcceptedDonations(prev => prev.map(d => d._id === donation._id ? res.data.data : d));
//           setOtpInputs(prev => ({ ...prev, [donation._id]: "" }));
//         } catch (err) {
//           setOtpErrors(prev => ({ ...prev, [donation._id]: err.response?.data?.error || "OTP verify failed" }));
//         } finally {
//           setOtpLoading(prev => ({ ...prev, [donation._id]: false }));
//         }
//       },
//       () => { alert("Location allow karo!"); setOtpLoading(prev => ({ ...prev, [donation._id]: false })); },
//       { enableHighAccuracy: true, timeout: 15000 }
//     );
//   };

//   const handleCompletePickup = async (donation) => {
//     try {
//       const res = await axios.put(`${API_URL}/donation/complete-pickup/${donation._id}`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
//       setAcceptedDonations(prev => prev.map(d => d._id === donation._id ? res.data.data : d));
//       if (locationIntervals.current[donation._id]) clearInterval(locationIntervals.current[donation._id]);
//     } catch (err) { console.error("Complete error:", err); }
//   };

//   const renderTrackingSection = (d) => {
//     const ngoLoc = ngoLiveLocations[d._id] || d.ngoLiveLocation;

//     if (d.pickupStatus === "otp_pending") {
//       return (
//         <div style={{ marginTop: 12 }}>
//           <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
//             <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>🚗 Donor ke paas jao — route dekho</p>
//             <p style={{ color: "rgba(187,247,208,0.4)", fontSize: 12, margin: 0 }}>Pahuncho toh OTP maango</p>
//           </div>
//           <TrackingMap ngoLocation={ngoLoc} donorLocation={d.donorLocation} donorAddress={d.donorLocation?.address || d.location} isNgo={true} showRoute={true} />
//           <div style={{ display: "flex", gap: 12, margin: "6px 0 10px", fontSize: 11, color: "rgba(187,247,208,0.4)" }}>
//             <span>🟢 Aap</span><span>🔴 Pickup point</span>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               type="number" placeholder="Donor ka OTP"
//               value={otpInputs[d._id] || ""}
//               onChange={e => {
//                 const val = e.target.value.replace(/\D/g, "").slice(0, 4);
//                 setOtpInputs(prev => ({ ...prev, [d._id]: val }));
//                 setOtpErrors(prev => ({ ...prev, [d._id]: "" }));
//               }}
//               style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: `1px solid ${otpErrors[d._id] ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.3)"}`, borderRadius: 10, padding: "10px", color: "#f0fdf4", fontSize: 20, fontWeight: 700, outline: "none", letterSpacing: "0.3em", textAlign: "center", fontFamily: "inherit" }}
//             />
//             <button
//               onClick={() => handleVerifyOtp(d)}
//               disabled={otpLoading[d._id] || otpInputs[d._id]?.length !== 4}
//               style={{ background: otpInputs[d._id]?.length === 4 ? "linear-gradient(135deg, #1d4ed8, #2563eb)" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: otpInputs[d._id]?.length === 4 ? "pointer" : "not-allowed", fontFamily: "inherit", whiteSpace: "nowrap" }}
//             >
//               {otpLoading[d._id] ? "⏳" : "✅ Verify"}
//             </button>
//           </div>
//           {otpErrors[d._id] && (
//             <div style={{ marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "8px 12px", color: "#fca5a5", fontSize: 13 }}>
//               {otpErrors[d._id]}
//             </div>
//           )}
//         </div>
//       );
//     }

//     if (d.pickupStatus === "on_the_way") {
//       return (
//         <div style={{ marginTop: 12 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
//             <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa", display: "inline-block", animation: "pulse 1.5s infinite" }} />
//             <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 600 }}>✅ OTP Verified! Deliver karo</span>
//           </div>
//           <TrackingMap ngoLocation={ngoLoc} donorLocation={d.donorLocation} donorAddress={d.donorLocation?.address || d.location} isNgo={true} showRoute={true} />
//           <div style={{ display: "flex", gap: 12, margin: "6px 0 10px", fontSize: 11, color: "rgba(187,247,208,0.4)" }}>
//             <span>🟢 Aap</span><span>🔴 Pickup point</span>
//           </div>
//           <button onClick={() => handleCompletePickup(d)} style={{ background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
//             ✅ Mark as Delivered
//           </button>
//         </div>
//       );
//     }

//     if (d.pickupStatus === "completed" || d.status === "completed") {
//       return (
//         <div style={{ marginTop: 10, color: "#4ade80", fontWeight: 600, fontSize: 13, textAlign: "center", padding: "10px", background: "rgba(74,222,128,0.08)", borderRadius: 10, border: "1px solid rgba(74,222,128,0.2)" }}>
//           🎉 Delivered Successfully!
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderCard = (d, action, isPending) => (
//     <div key={d._id} style={{ background: "rgba(5,18,11,0.85)", border: `1px solid ${isPending ? "rgba(234,179,8,0.15)" : d.status === "completed" ? "rgba(96,165,250,0.15)" : "rgba(34,197,94,0.15)"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 12, backdropFilter: "blur(12px)", position: "relative" }}>
//       <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isPending ? "linear-gradient(to bottom, #fbbf24, #f59e0b)" : d.status === "completed" ? "linear-gradient(to bottom, #60a5fa, #3b82f6)" : "linear-gradient(to bottom, #4ade80, #16a34a)", borderRadius: "16px 0 0 16px" }} />

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, paddingLeft: 8 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
//           {d.photo && <img src={d.photo} alt={d.foodName} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />}
//           <div style={{ minWidth: 0 }}>
//             <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0fdf4", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.foodName}</p>
//             {d.createdBy && <p style={{ fontSize: 12, color: "rgba(187,247,208,0.8)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>👤 {d.createdBy.name}</p>}
//             <p style={{ fontSize: 12, color: "rgba(187,247,208,0.55)", margin: "0 0 2px" }}>🍴 {d.quantity}</p>
//             <p style={{ fontSize: 12, color: "rgba(187,247,208,0.55)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {d.location}</p>
//             {d.status === "completed" && (
//               <span style={{ display: "inline-block", background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginTop: 3 }}>✅ Delivered</span>
//             )}
//           </div>
//         </div>
//         {/* Cancel button sirf active donations pe */}
//         {!isPending && d.status !== "completed" && action}
//         {isPending && action}
//       </div>

//       {!isPending && renderTrackingSection(d)}
//     </div>
//   );

//   const pendingCount = pendingDonations.length;
//   const acceptedCount = acceptedDonations.filter(d => d.status === "accepted").length;
//   const completedCount = acceptedDonations.filter(d => d.status === "completed").length;

//   return (
//     <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
//       {/* Background */}
//       <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
//         <div style={{ position: "absolute", top: "-5%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
//         <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
//       </div>

//       <div className="ngo-inner" style={{ position: "relative", zIndex: 1 }}>

//         {/* Header */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 12, fontSize: 11, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
//             Live Dashboard
//           </div>
//           <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)", fontWeight: 800, color: "#f0fdf4", margin: "0 0 4px" }}>NGO Dashboard</h1>
//           <p style={{ color: "rgba(187,247,208,0.45)", fontSize: "0.9rem", margin: 0 }}>
//             Welcome, <span style={{ color: "#fff", fontWeight: 700 }}>{user?.name || "NGO"}</span>!
//           </p>
//         </div>

//         {/* Stats */}
//         <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
//           {[
//             { label: "Pending", count: pendingCount, color: "#fbbf24", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
//             { label: "Active", count: acceptedCount, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
//             { label: "Delivered", count: completedCount, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
//           ].map((s, i) => (
//             <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 80 }}>
//               <span style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.count}</span>
//               <span style={{ fontSize: 12, color: "rgba(187,247,208,0.6)", fontWeight: 500 }}>{s.label}</span>
//             </div>
//           ))}
//         </div>

//         {/* Mobile Tabs */}
//         <div className="mobile-tabs" style={{ display: "none", gap: 8, marginBottom: 16 }}>
//           {[
//             { key: "pending", label: `Pending (${pendingCount})`, color: "#fbbf24" },
//             { key: "accepted", label: `My Donations (${acceptedDonations.length})`, color: "#4ade80" },
//           ].map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 flex: 1, padding: "10px", borderRadius: 10, border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
//                 background: activeTab === tab.key ? tab.color : "rgba(255,255,255,0.05)",
//                 color: activeTab === tab.key ? "#000" : "rgba(187,247,208,0.5)",
//                 transition: "all 0.2s"
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Desktop Grid / Mobile Single Column */}
//         <div className="ngo-grid">
//           {/* Pending */}
//           <section className={activeTab === "pending" ? "tab-show" : "tab-hide"}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
//               <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>Pending Donations</h2>
//               <span style={{ marginLeft: "auto", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{pendingCount}</span>
//             </div>
//             {pendingDonations.length === 0
//               ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 14, padding: "28px 16px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: 14 }}>No pending donations.</div>
//               : pendingDonations.map(d => renderCard(d,
//                   <button onClick={() => handleAccept(d)} style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>
//                     <CheckCircle size={14} /> Accept
//                   </button>, true))
//             }
//           </section>

//           {/* Accepted + Completed */}
//           <section className={activeTab === "accepted" ? "tab-show" : "tab-hide"}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
//               <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>My Donations</h2>
//               <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{acceptedDonations.length}</span>
//             </div>
//             {acceptedDonations.length === 0
//               ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 14, padding: "28px 16px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: 14 }}>No donations yet.</div>
//               : acceptedDonations.map(d => renderCard(d,
//                   <button onClick={() => handleCancel(d)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}
//                     onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}>
//                     <XCircle size={14} /> Cancel
//                   </button>, false))
//             }
//           </section>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
//         * { box-sizing: border-box; }
//         .ngo-inner { max-width: 1100px; margin: 0 auto; padding: 80px 28px 60px 110px; }
//         .ngo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
//         .tab-show { display: block; }
//         .tab-hide { display: block; }
//         .mobile-tabs { display: none !important; }

//         @media (max-width: 768px) {
//           .ngo-inner { padding: 70px 14px 80px 14px !important; }
//           .ngo-grid { grid-template-columns: 1fr !important; gap: 0; }
//           .mobile-tabs { display: flex !important; }
//           .tab-hide { display: none !important; }
//           .tab-show { display: block !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NgoDashboard; 

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

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
const formatTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

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

    socket.on("connect", () => {
      console.log("✅ NGO socket connected:", socket.id);
    });

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

  const handleAccept = async (donation) => {
    if (!navigator.geolocation) { alert("Geolocation support nahi!"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const ngoLat = pos.coords.latitude;
        const ngoLng = pos.coords.longitude;
        try {
          const res = await axios.put(
            `${API_URL}/donation/accept/${donation._id}`,
            { ngoLat, ngoLng },
            { headers: { Authorization: `Bearer ${getToken()}` } }
          );
          setPendingDonations(prev => prev.filter(d => d._id !== donation._id));
          setAcceptedDonations(prev =>
            prev.find(d => d._id === donation._id) ? prev : [res.data.data, ...prev]
          );
          setNgoLiveLocations(prev => ({ ...prev, [donation._id]: { lat: ngoLat, lng: ngoLng } }));
          startLocationInterval(donation._id);
          setActiveTab("accepted");
        } catch (err) { alert("Failed: " + (err.response?.data?.error || err.message)); }
      },
      () => alert("Location allow karo!"),
      { enableHighAccuracy: true, timeout: 15000 }
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
      { enableHighAccuracy: true, timeout: 15000 }
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
            <span>🟢 Aap</span><span>🔴 Pickup point</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              placeholder="Donor ka OTP"
              value={otpInputs[d._id] || ""}
              inputMode="numeric"
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setOtpInputs(prev => ({ ...prev, [d._id]: val }));
                setOtpErrors(prev => ({ ...prev, [d._id]: "" }));
              }}
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: `1px solid ${otpErrors[d._id] ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.3)"}`, borderRadius: 10, padding: "10px", color: "#f0fdf4", fontSize: 22, fontWeight: 700, outline: "none", letterSpacing: "0.3em", textAlign: "center", fontFamily: "inherit" }}
            />
            <button
              onClick={() => handleVerifyOtp(d)}
              disabled={otpLoading[d._id] || otpInputs[d._id]?.length !== 4}
              style={{ background: otpInputs[d._id]?.length === 4 ? "linear-gradient(135deg, #1d4ed8, #2563eb)" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: otpInputs[d._id]?.length === 4 ? "pointer" : "not-allowed", fontFamily: "inherit", whiteSpace: "nowrap" }}
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
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa", display: "inline-block", animation: "pulse 1.5s infinite" }} />
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
            <span>🟢 Aap</span><span>🔴 Pickup point</span>
          </div>
          <button
            onClick={() => handleCompletePickup(d)}
            style={{ background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }}
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
    <div key={d._id} style={{ background: "rgba(5,18,11,0.9)", border: `1px solid ${isPending ? "rgba(234,179,8,0.2)" : d.status === "completed" ? "rgba(96,165,250,0.2)" : "rgba(34,197,94,0.2)"}`, borderRadius: 16, padding: "14px", marginBottom: 12, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isPending ? "linear-gradient(to bottom, #fbbf24, #f59e0b)" : d.status === "completed" ? "linear-gradient(to bottom, #60a5fa, #3b82f6)" : "linear-gradient(to bottom, #4ade80, #16a34a)", borderRadius: "16px 0 0 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, paddingLeft: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          {d.photo && <img src={d.photo} alt={d.foodName} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f0fdf4", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.foodName}</p>
            {d.createdBy && <p style={{ fontSize: 12, color: "rgba(187,247,208,0.8)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>👤 {d.createdBy.name}</p>}
            <p style={{ fontSize: 12, color: "rgba(187,247,208,0.55)", margin: "0 0 2px" }}>🍴 {d.quantity}</p>
            <p style={{ fontSize: 12, color: "rgba(187,247,208,0.55)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {d.location}</p>
            {d.status === "completed" && (
              <span style={{ display: "inline-block", background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginTop: 3 }}>✅ Delivered</span>
            )}
          </div>
        </div>
        {isPending && action}
        {!isPending && d.status !== "completed" && action}
      </div>
      {!isPending && renderTrackingSection(d)}
    </div>
  );

  const pendingCount = pendingDonations.length;
  const acceptedCount = acceptedDonations.filter(d => d.status === "accepted").length;
  const completedCount = acceptedDonations.filter(d => d.status === "completed").length;

  return (
    <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-5%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: isMobile ? "70px 14px 90px 14px" : "80px 28px 60px 110px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 10, fontSize: 11, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
            Live Dashboard
          </div>
          <h1 style={{ fontSize: isMobile ? "1.5rem" : "2.2rem", fontWeight: 800, color: "#f0fdf4", margin: "0 0 4px" }}>NGO Dashboard</h1>
          <p style={{ color: "rgba(187,247,208,0.45)", fontSize: "0.88rem", margin: 0 }}>
            Welcome, <span style={{ color: "#fff", fontWeight: 700 }}>{user?.name || "NGO"}</span>!
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Pending", count: pendingCount, color: "#fbbf24", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
            { label: "Active", count: acceptedCount, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
            { label: "Delivered", count: completedCount, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 80 }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: 12, color: "rgba(187,247,208,0.6)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Mobile Tabs */}
        {isMobile && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { key: "pending", label: `Pending (${pendingCount})`, color: "#fbbf24" },
              { key: "accepted", label: `My Donations (${acceptedDonations.length})`, color: "#4ade80" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.key ? tab.color : "rgba(255,255,255,0.06)", color: activeTab === tab.key ? "#000" : "rgba(187,247,208,0.5)", transition: "all 0.2s" }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Pending Section */}
          {(!isMobile || activeTab === "pending") && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>Pending Donations</h2>
                <span style={{ marginLeft: "auto", background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{pendingCount}</span>
              </div>
              {pendingDonations.length === 0
                ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 14, padding: "28px 16px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: 14 }}>No pending donations.</div>
                : pendingDonations.map(d => renderCard(d,
                    <button onClick={() => handleAccept(d)} style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #14532d, #16a34a)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>
                      <CheckCircle size={14} /> Accept
                    </button>, true))
              }
            </section>
          )}

          {/* Accepted + Completed Section */}
          {(!isMobile || activeTab === "accepted") && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#f0fdf4", margin: 0 }}>My Donations</h2>
                <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", borderRadius: 100, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{acceptedDonations.length}</span>
              </div>
              {acceptedDonations.length === 0
                ? <div style={{ background: "rgba(5,18,11,0.6)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: 14, padding: "28px 16px", textAlign: "center", color: "rgba(187,247,208,0.3)", fontSize: 14 }}>No donations yet.</div>
                : acceptedDonations.map(d => renderCard(d,
                    <button onClick={() => handleCancel(d)}
                      style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>
                      <XCircle size={13} /> Cancel
                    </button>, false))
              }
            </section>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default NgoDashboard;