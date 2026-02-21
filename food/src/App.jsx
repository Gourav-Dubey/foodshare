import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./pages/HeroSection";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./pages/AboutUs";
import ContactSection from "./components/ContactSection";
import SideDock from "./components/SideDock";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import FoodSharingProcess from "./components/FoodSharingProcess";
import AIAssistant from "./components/AIAssistant"; // 👈 IMPORTANT

// Dashboards
import DonateFoodPage from "./pages/DonateFoodPage";
import NgoDashboard from "./pages/NgoDashboard";

const App = () => {
  const [isAIOpen, setIsAIOpen] = useState(false); // 👈 Global AI State

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        {/* Navbar */}
        <Navbar onAIOpen={() => setIsAIOpen(true)} />

        {/* SideDock */}
        <SideDock onAIOpen={() => setIsAIOpen(true)} />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <HowItWorks />
                  <FoodSharingProcess />
                </>
              }
            />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/donor-dashboard" element={<DonateFoodPage />} />
            <Route path="/ngo-dashboard" element={<NgoDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* GLOBAL AI PANEL */}
        <AIAssistant
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />
      </div>
    </Router>
  );
};

export default App;