import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const NgoDashboard = () => {
  const [pendingDonations, setPendingDonations] = useState([
    {
      id: 1,
      foodName: "Cooked Rice",
      quantity: "5 kg",
      location: "Delhi, India",
      expiry: "2 hours",
      photo: "https://source.unsplash.com/400x300/?rice",
    },
    {
      id: 2,
      foodName: "Bread Loaves",
      quantity: "20 pieces",
      location: "Mumbai, India",
      expiry: "6 hours",
      photo: "https://source.unsplash.com/400x300/?bread",
    },
  ]);

  const [acceptedDonations, setAcceptedDonations] = useState([]);

  const handleAccept = (donation) => {
    setPendingDonations(pendingDonations.filter((d) => d.id !== donation.id));
    setAcceptedDonations([...acceptedDonations, donation]);
  };

  const handleCancel = (donation) => {
    setAcceptedDonations(acceptedDonations.filter((d) => d.id !== donation.id));
    setPendingDonations([...pendingDonations, donation]);
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
                key={donation.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                <img
                  src={donation.photo}
                  alt={donation.foodName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {donation.foodName}
                  </h3>
                  <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                  <p className="text-sm text-gray-600">Location: {donation.location}</p>
                  <p className="text-sm text-gray-600">Expiry: {donation.expiry}</p>
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
                key={donation.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                <img
                  src={donation.photo}
                  alt={donation.foodName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {donation.foodName}
                  </h3>
                  <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                  <p className="text-sm text-gray-600">Location: {donation.location}</p>
                  <p className="text-sm text-gray-600">Expiry: {donation.expiry}</p>
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


