import React from "react";
import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaMoneyBillWave, FaClock } from "react-icons/fa";

const DonorDashboard = () => {
  // Dummy data (baad me backend se aayega)
  const stats = [
    { title: "Total Donations", value: 12, icon: <FaHandHoldingHeart /> },
    { title: "Amount Donated", value: "₹8,500", icon: <FaMoneyBillWave /> },
    { title: "Last Donation", value: "2 days ago", icon: <FaClock /> },
  ];

  const upcomingRequests = [
    { ngo: "Helping Hands", need: "Food for 50 people", urgency: "High" },
    { ngo: "Green Earth", need: "Clothes for 30 children", urgency: "Medium" },
  ];

  const recentDonations = [
    { ngo: "Helping Hands", item: "₹1000", date: "28 Aug 2025" },
    { ngo: "Food For All", item: "Food Packets", date: "20 Aug 2025" },
    { ngo: "Green Earth", item: "₹500", date: "10 Aug 2025" },
  ];

  return (
    <div className="p-16 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">Donor Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow rounded-2xl flex items-center gap-4"
          >
            <div className="text-3xl text-blue-600">{stat.icon}</div>
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <h2 className="text-xl font-bold">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Requests */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Requests</h2>
        <div className="space-y-4">
          {upcomingRequests.map((req, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-100 rounded-xl shadow-sm flex justify-between"
            >
              <div>
                <h3 className="font-bold">{req.ngo}</h3>
                <p>{req.need}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  req.urgency === "High"
                    ? "bg-red-200 text-red-700"
                    : "bg-yellow-200 text-yellow-700"
                }`}
              >
                {req.urgency}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Donations</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">NGO</th>
                <th className="p-3">Donation</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((don, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{don.ngo}</td>
                  <td className="p-3">{don.item}</td>
                  <td className="p-3">{don.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Future - AI Suggestions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">AI Suggestions</h2>
        <p className="text-gray-500">
          (Yaha AI system suggest karega ki kis NGO ko urgent help chahiye)
        </p>
      </div>
    </div>
  );
};

export default DonorDashboard;
