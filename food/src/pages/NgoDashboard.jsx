import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { CheckCircle, XCircle } from "lucide-react";

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
        const token = localStorage.getItem("token");
        const pendingRes = await axios.get(`${API_URL}/donation/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const acceptedRes = await axios.get(`${API_URL}/donation/accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🔥 Reverse so that recent donations are on top
        setPendingDonations((pendingRes.data.data || []).reverse());
        setAcceptedDonations((acceptedRes.data.data || []).reverse());
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();

    socket.on("connect", () => console.log("WebSocket connected:", socket.id));
    socket.on("disconnect", () => console.log("WebSocket disconnected"));

    // ✅ Duplicate prevention + recent-first insert
    socket.on("newDonation", (donation) => {
      setPendingDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [donation, ...filtered]; // recent on top
      });
    });

    socket.on("donationAccepted", (donation) => {
      setPendingDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setAcceptedDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [donation, ...filtered]; // recent on top
      });
    });

    socket.on("donationCancelled", (donation) => {
      setAcceptedDonations((prev) => prev.filter((d) => d._id !== donation._id));
      setPendingDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [donation, ...filtered]; // recent on top
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
        return [res.data.data, ...filtered]; // recent on top
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
      setAcceptedDonations((prev) =>
        prev.filter((d) => d._id !== donation._id)
      );
      setPendingDonations((prev) => {
        const filtered = prev.filter((d) => d._id !== donation._id);
        return [res.data.data, ...filtered]; // recent on top
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderDonationCard = (d, action) => (
    <div
      key={d._id}
      className="border p-3 mb-2 flex justify-between items-center gap-4 rounded-lg shadow-sm bg-white"
    >
      <div className="flex items-center gap-3">
        {d.photo && (
          <img
            src={d.photo}
            alt={d.foodName}
            className="w-16 h-16 object-cover rounded-md border"
          />
        )}
        <div>
          <p className="font-semibold text-gray-800">{d.foodName}</p>
          <p className="text-sm text-gray-600">🍴 {d.quantity}</p>
          <p className="text-sm text-gray-600">📍 {d.location}</p>
          <p className="text-sm text-gray-600">⏰ {d.expiry}</p>
        </div>
      </div>
      {action}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">NGO Dashboard</h1>

      {/* Pending Donations */}
      <section className="mb-8">
        <h2 className="text-2xl mb-4">Pending Donations</h2>
        {pendingDonations.length === 0 ? (
          <p className="text-gray-500">No pending donations.</p>
        ) : (
          pendingDonations.map((d) =>
            renderDonationCard(
              d,
              <button
                onClick={() => handleAccept(d)}
                className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600"
              >
                <CheckCircle size={16} /> Accept
              </button>
            )
          )
        )}
      </section>

      {/* Accepted Donations */}
      <section>
        <h2 className="text-2xl mb-4">Accepted Donations</h2>
        {acceptedDonations.length === 0 ? (
          <p className="text-gray-500">No accepted donations.</p>
        ) : (
          acceptedDonations.map((d) =>
            renderDonationCard(
              d,
              <button
                onClick={() => handleCancel(d)}
                className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600"
              >
                <XCircle size={16} /> Cancel
              </button>
            )
          )
        )}
      </section>
    </div>
  );
};

export default NgoDashboard;

