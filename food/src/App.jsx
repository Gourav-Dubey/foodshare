
import React from "react";
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
import FoodSharingProcess  from "./components/FoodSharingProcess";




// Dashboards
import DonateFoodPage from "./pages/DonateFoodPage";   // donor dashboard
import NgoDashboard from "./pages/NgoDashboard";       // ngo dashboard

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar />

        {/* SideDock - Always visible */}
        <SideDock />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            {/* Home Page */}
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

            {/* Other Pages */}
            <Route path="/about" element={<AboutUs />} />
          
            <Route path="/contact" element={<ContactSection />} />

            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboards */}
            <Route path="/donor-dashboard" element={<DonateFoodPage />} />
            <Route path="/ngo-dashboard" element={<NgoDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
