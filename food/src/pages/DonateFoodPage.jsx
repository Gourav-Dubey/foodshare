import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Gift } from "lucide-react";
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

const DonorDashboard = ({ donorName = "Donor" }) => {
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    location: "",
    expiry: "", // ✅ backend ke field ke saath match
    photo: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    socket.on("donationAccepted", (updatedDonation) => {
      setDonations((prev) =>
        prev.map((donation) =>
          donation._id === updatedDonation._id ? updatedDonation : donation
        )
      );
    });

    socket.on("donationCancelled", (updatedDonation) => {
      setDonations((prev) =>
        prev.map((donation) =>
          donation._id === updatedDonation._id ? updatedDonation : donation
        )
      );
    });

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
    if (
      !formData.foodName ||
      !formData.quantity ||
      !formData.location ||
      !formData.expiry ||
      !formData.photo
    ) {
      alert("Please fill all fields including photo!");
      return;
    }

    try {
      const data = new FormData();
      data.append("foodName", formData.foodName);
      data.append("quantity", formData.quantity);
      data.append("location", formData.location);
      data.append("expiry", formData.expiry);
      data.append("photo", formData.photo);

      const res = await axios.post(`${API_URL}/donation`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Donation submitted:", res.data);

      const newDonation = res.data.data; // ✅ backend se `data` ke andar aata hai
      setDonations([newDonation, ...donations]);

      setFormData({
        foodName: "",
        quantity: "",
        location: "",
        expiry: "",
        photo: null,
      });
      setPreview(null);
    } catch (err) {
      console.error(
        "❌ Error submitting donation:",
        err.response?.data || err.message || err
      );
    }
  };

  // ✅ Status label format
  const getStatusLabel = (status) => {
    if (status === "accepted") return "Accepted by NGO ✅";
    return "Pending NGO Approval";
  };

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-br from-green-100 via-white to-green-50 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-lg sm:text-2xl font-bold">
            Welcome back, {donorName}! 🌟
          </h1>
        </div>
        <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-lg px-2">
          “Your small contribution can make a big difference.” 💚
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/70 p-5 sm:p-8 rounded-2xl shadow-xl border border-green-200"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
            Donate Food 🍲
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <input
              type="text"
              name="foodName"
              placeholder="Food Name"
              value={formData.foodName}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 sm:p-3 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
            />
            <input
              type="text"
              name="quantity"
              placeholder="Quantity (e.g., 5 plates)"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 sm:p-3 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
            />
            <input
              type="text"
              name="location"
              placeholder="Pickup Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 sm:p-3 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
            />
            <input
              type="text"
              name="expiry"
              placeholder="Expiry Time (e.g., 2 hours)"
              value={formData.expiry}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 sm:p-3 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
            />

            <div className="border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center hover:bg-green-50 transition">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2" />
                <span className="text-gray-600 text-xs sm:text-sm">
                  Upload Food Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition text-sm sm:text-base"
            >
              Submit Donation
            </motion.button>
          </form>
        </motion.div>

        {/* List */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
            Your Submissions 📋
          </h2>
          {donations.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">
              No donations submitted yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {donations.map((donation) => (
                <motion.div
                  key={donation._id || donation.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-200"
                >
                  <img
                    src={donation.photo || "https://source.unsplash.com/400x300/?food"}
                    alt={donation.foodName}
                    className="w-full h-32 sm:h-40 object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">
                      {donation.foodName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      🍴 Quantity: {donation.quantity}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      📍 Location: {donation.location}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      ⏰ Expiry: {donation.expiry}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        donation.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {getStatusLabel(donation.status)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
