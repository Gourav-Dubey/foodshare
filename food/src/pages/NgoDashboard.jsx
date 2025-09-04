import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://foodsharebackend.onrender.com/api";

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://foodsharebackend.onrender.com"
);

const NgoDashboard = () => {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(`${API_URL}/donation/pending`);

        console.log("📥 Pending donations response:", res.data);

        if (Array.isArray(res.data.data)) {
          setPendingDonations(res.data.data);
        } else {
          console.error("❌ API did not return array:", res.data);
          setPendingDonations([]);
        }
      } catch (err) {
        console.error("❌ Error fetching donations:", err);
        setPendingDonations([]);
      }
    };

    fetchDonations();

    // ✅ Real-time updates
    socket.on("newDonation", (donation) => {
      setPendingDonations((prev) => [...prev, donation]);
    });

    socket.on("donationAccepted", (updated) => {
      setPendingDonations((prev) => prev.filter((d) => d._id !== updated._id));
      setAcceptedDonations((prev) => [...prev, updated]);
    });

    socket.on("donationCancelled", (updated) => {
      setAcceptedDonations((prev) => prev.filter((d) => d._id !== updated._id));
      setPendingDonations((prev) => [...prev, updated]);
    });

    return () => {
      socket.off("newDonation");
      socket.off("donationAccepted");
      socket.off("donationCancelled");
    };
  }, []);

  const handleAccept = async (donation) => {
    try {
      const res = await axios.put(`${API_URL}/donation/accept/${donation._id}`);
      setPendingDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setAcceptedDonations((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("❌ Error accepting donation:", err);
    }
  };

  const handleCancel = async (donation) => {
    try {
      const res = await axios.put(`${API_URL}/donation/cancel/${donation._id}`);
      setAcceptedDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setPendingDonations((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("❌ Error cancelling donation:", err);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-center text-purple-700 mb-8"
      >
        🌟 Welcome, NGO Member 🌟
      </motion.h1>

      {/* Pending Donations */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Donations</h2>
        {pendingDonations.length === 0 ? (
          <p className="text-gray-600">No pending donations right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingDonations.map((donation) => (
              <motion.div
                key={donation._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                <img
                  src={donation.photo || "https://source.unsplash.com/400x300/?food"}
                  alt={donation.foodName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{donation.foodName}</h3>
                  <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                  <p className="text-sm text-gray-600">Location: {donation.location}</p>
                  <p className="text-sm text-gray-600">Expiry: {donation.expiry || "N/A"}</p>
                  <span className="mt-2 inline-block px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 w-max">
                    Pending
                  </span>
                  <button
                    onClick={() => handleAccept(donation)}
                    className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded-xl hover:opacity-90 transition"
                  >
                    <CheckCircle className="w-5 h-5" /> Accept
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Accepted Donations */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Accepted Donations</h2>
        {acceptedDonations.length === 0 ? (
          <p className="text-gray-600">No accepted donations yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {acceptedDonations.map((donation) => (
              <motion.div
                key={donation._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                <img
                  src={donation.photo || "https://source.unsplash.com/400x300/?food"}
                  alt={donation.foodName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{donation.foodName}</h3>
                  <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                  <p className="text-sm text-gray-600">Location: {donation.location}</p>
                  <p className="text-sm text-gray-600">Expiry: {donation.expiry || "N/A"}</p>
                  <span className="mt-2 inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 w-max">
                    Accepted
                  </span>
                  <button
                    onClick={() => handleCancel(donation)}
                    className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-600 text-white py-2 px-4 rounded-xl hover:opacity-90 transition"
                  >
                    <XCircle className="w-5 h-5" /> Cancel
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NgoDashboard;
