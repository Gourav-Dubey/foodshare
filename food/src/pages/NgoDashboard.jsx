import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ClipboardList, Truck, PieChart } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const NgoDashboard = () => {
  const [requests, setRequests] = useState([
    { id: 1, donor: "Gourav", item: "Rice - 5kg", status: "Pending" },
    { id: 2, donor: "Ramesh", item: "Vegetables - 10kg", status: "Pickup Scheduled" },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800"
      >
        NGO Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <ClipboardList className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Active Requests</p>
              <p className="text-xl font-bold">{requests.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <Truck className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Scheduled Pickups</p>
              <p className="text-xl font-bold">
                {requests.filter((r) => r.status.includes("Pickup")).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <PieChart className="w-10 h-10 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Completed Deliveries</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-red-500" />
          Food Requests
        </h2>

        {requests.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center p-4 border-b last:border-0"
          >
            <div>
              <p className="font-medium">{req.item}</p>
              <p className="text-sm text-gray-500">Donor: {req.donor}</p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-medium ${
                    req.status === "Pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {req.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {req.status === "Pending" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(req.id, "Pickup Scheduled")}
                >
                  Schedule Pickup
                </Button>
              )}
              {req.status === "Pickup Scheduled" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleUpdateStatus(req.id, "Completed")}
                >
                  Mark Completed
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NgoDashboard;
