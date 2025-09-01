import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDonate, FaCheckCircle, FaTruck, FaHandsHelping, FaChartLine, FaHeart } from 'react-icons/fa';
import { Link } from "react-router-dom";

const FoodSharingProcess = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Food Donation",
      description: "Restaurants, hotels, and individuals list their surplus food through our platform with just a few clicks.",
      image: "1.jpg",
      icon: <FaDonate className="text-2xl" />,
      color: "from-amber-400 to-orange-500",
      gradient: "bg-gradient-to-r from-amber-400 to-orange-500"
    },
    {
      id: 2,
      title: "Quality Check",
      description: "Our expert team verifies food quality and ensures it meets the highest safety standards before distribution.",
      image: "2.jpg",
      icon: <FaCheckCircle className="text-2xl" />,
      color: "from-emerald-400 to-green-500",
      gradient: "bg-gradient-to-r from-emerald-400 to-green-500"
    },
    {
      id: 3,
      title: "Matching & Dispatch",
      description: "Smart algorithms match donations with nearby NGOs and arrange for prompt pickup or delivery.",
      image: "3.avif",
      icon: <FaTruck className="text-2xl" />,
      color: "from-blue-400 to-cyan-500",
      gradient: "bg-gradient-to-r from-blue-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Distribution",
      description: "Food reaches those in need through our extensive network of trusted partner NGOs and volunteers.",
      image: "4.jpeg",
      icon: <FaHandsHelping className="text-2xl" />,
      color: "from-purple-400 to-fuchsia-500",
      gradient: "bg-gradient-to-r from-purple-400 to-fuchsia-500"
    },
    {
      id: 5,
      title: "Impact Tracking",
      description: "Donors receive detailed reports and real-time updates on how their contribution made a meaningful difference.",
      image: "5.jpeg",
      icon: <FaChartLine className="text-2xl" />,
      color: "from-rose-400 to-pink-500",
      gradient: "bg-gradient-to-r from-rose-400 to-pink-500"
    }
  ];

  return (
    <section className="py-12 lg:py-8 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-10 left-5 w-48 h-48 lg:w-72 lg:h-72 bg-amber-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-5 w-52 h-52 lg:w-80 lg:h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-medium"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 lg:w-64 lg:h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl mb-6 shadow-lg shadow-green-200/60"
          >
            <FaHeart className="text-2xl lg:text-3xl text-white" />
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4 px-4">
            The <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Beautiful Journey</span> of Food Sharing
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Witness how surplus food transforms into hope and nourishment for communities in need
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Decorative connecting line - hidden on mobile */}
          {!isMobile && (
            <div className="hidden lg:block absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-400 via-green-400 to-pink-400 rounded-full opacity-60"></div>
          )}
          
          {/* Animated floating elements - hidden on mobile */}
          {!isMobile && (
            <>
              <div className="hidden lg:block absolute -left-10 top-1/4 animate-float-slow">
                <div className="w-8 h-8 bg-amber-400/30 rounded-full"></div>
              </div>
              <div className="hidden lg:block absolute -right-10 top-1/2 animate-float-medium">
                <div className="w-10 h-10 bg-green-400/30 rounded-full"></div>
              </div>
              <div className="hidden lg:block absolute -left-8 bottom-1/4 animate-float-fast">
                <div className="w-6 h-6 bg-blue-400/30 rounded-full"></div>
              </div>
            </>
          )}

          <div className="space-y-16 lg:space-y-32">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                id={`step-${step.id}`}
                className={`flex flex-col ${index % 2 === 0 && !isMobile ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center lg:justify-between gap-8 lg:gap-12`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Image with beautiful frame */}
                <div className="w-full lg:w-2/5 relative">
                  <motion.div 
                    className="relative overflow-hidden rounded-3xl shadow-2xl"
                    whileHover={!isMobile ? { scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="relative overflow-hidden rounded-3xl">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-64 lg:h-80 object-cover transform transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      
                      {/* Step number badge */}
                      <div className={`absolute -top-3 -left-3 lg:-top-4 lg:-left-4 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${step.gradient} flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-lg`}>
                        {step.id}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Floating icon */}
                  <motion.div 
                    className={`absolute -bottom-3 -right-3 lg:-bottom-4 lg:-right-4 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl ${step.gradient} flex items-center justify-center text-white shadow-lg`}
                    whileHover={!isMobile ? { scale: 1.1, rotate: 5 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-2/5 px-2 lg:px-0">
                  <motion.div 
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20"
                    whileHover={!isMobile ? { y: -5 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">{step.title}</h3>
                    <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">{step.description}</p>
                    
                    {/* Progress dots */}
                    <div className="flex space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full ${i < step.id ? 'bg-green-400' : 'bg-gray-300'}`}
                        ></div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Stats with beautiful cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-16 lg:mt-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {[
            { value: "10,000+", label: "Meals Daily", icon: "🍽️", color: "bg-amber-500", delay: 0 },
            { value: "50+", label: "Cities", icon: "🏙️", color: "bg-blue-500", delay: 0.1 },
            { value: "1,200+", label: "NGOs", icon: "🤝", color: "bg-purple-500", delay: 0.2 },
            { value: "95%", label: "Safety", icon: "⭐", color: "bg-green-500", delay: 0.3 }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-white/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              viewport={{ once: true }}
              whileHover={!isMobile ? { 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              } : {}}
            >
              <div className={`w-12 h-12 lg:w-16 lg:h-16 ${stat.color} rounded-2xl flex items-center justify-center text-xl lg:text-2xl text-white mx-auto mb-3 lg:mb-4 shadow-md`}>
                {stat.icon}
              </div>
              <div className="text-xl lg:text-3xl font-bold text-gray-800 mb-1 lg:mb-2">{stat.value}</div>
              <div className="text-xs lg:text-base text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16 lg:mt-20 p-8 lg:p-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-green-500 pattern-bg-white pattern-size-6 pattern-opacity-100"></div>
          </div>
          
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 relative z-10">Ready to Create Change?</h3>
          <p className="text-green-100 text-lg lg:text-xl mb-6 lg:mb-8 max-w-2xl mx-auto relative z-10">
            Join our movement and be part of the solution to hunger and food waste
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center relative z-10"> 
  <Link to="/login">
    <motion.button 
      whileHover={!isMobile ? { 
        scale: 1.05, 
        y: -2,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
      } : {}}
      whileTap={{ scale: 0.95 }}
      className="px-6 lg:px-8 py-3 lg:py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base"
    >
      <FaDonate />
      Donate Food Now
    </motion.button>
  </Link>

  <Link to="/register">
    <motion.button 
      whileHover={!isMobile ? { 
        scale: 1.05, 
        y: -2,
        boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.3)"
      } : {}}
      whileTap={{ scale: 0.95 }}
      className="px-6 lg:px-8 py-3 lg:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm lg:text-base"
    >
      Become a Volunteer
    </motion.button>
  </Link>
</div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-medium { animation: pulse-medium 7s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default FoodSharingProcess;