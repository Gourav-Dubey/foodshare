import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";
import { FaUtensils, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHandHoldingHeart, FaUsers, FaCheck } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    role: "donor",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // Check password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        role: formData.role,
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // ✅ Token + User info save
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", formData.role);

      alert("✅ Registration successful!");
      
      // Redirect based on role
      if (formData.role === "donor") {
        window.location.href = "/donor-dashboard";
      } else {
        window.location.href = "/ngo-dashboard";
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ submit: errorMessage });
      setTimeout(() => setErrors({}), 4000);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Strong";
    if (passwordStrength >= 50) return "Medium";
    if (passwordStrength >= 25) return "Weak";
    return "Very Weak";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <motion.div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <FaUtensils className="text-white text-2xl mr-2" />
            <h1 className="text-2xl font-bold text-white">FoodShare</h1>
          </div>
          <h2 className="text-xl font-semibold text-white mt-2">Create Account</h2>
          <p className="text-green-100 mt-1">Join us in the fight against hunger</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {errors.submit && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Role Selection */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: "donor"})}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                formData.role === "donor"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <FaHandHoldingHeart size={12} />
              <span>Donor</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: "ngo"})}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                formData.role === "ngo"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <FaUsers size={12} />
              <span>NGO</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaUser size={14} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope size={14} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock size={14} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Strength: {getPasswordStrengthText()}</span>
                    <span>{passwordStrength}%</span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock size={14} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start text-sm text-gray-600 mt-4">
              <input
                type="checkbox"
                required
                className="rounded text-green-500 focus:ring-green-500 mt-1 mr-2"
              />
              <span>I agree to the <a href="/terms" className="text-green-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a></span>
            </label>

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaCheck size={14} />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-green-600 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;