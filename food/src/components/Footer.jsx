
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Section */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Food Share Network</h2>
          <p className="text-sm">Sharing food, spreading smiles 🍲</p>
        </div>

        {/* Center Section - Links */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/ai" className="hover:underline">Ai</Link>
         
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook text-xl hover:text-gray-200"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter text-xl hover:text-gray-200"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram text-xl hover:text-gray-200"></i>
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-6 text-center text-sm text-gray-200 border-t border-gray-400 pt-3">
        © {new Date().getFullYear()} Food Share Network. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
