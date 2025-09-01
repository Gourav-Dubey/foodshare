import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaInfoCircle, FaHandHoldingHeart, FaPhone, FaUtensils, FaBars, FaTimes,FaRobot} from "react-icons/fa";
// import { AiFillRobot, AiOutlineCloud } from "react-icons/ai";


const FoodShareSideDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check screen size and update isMobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const buttons = [
    { id: "/", label: "Home", icon: <FaHome className="text-lg" /> },
    { id: "/about", label: "About", icon: <FaInfoCircle className="text-lg" /> },
    { id: "/ai", label: "AI", icon: <FaRobot className="text-lg" /> },
    { id: "/contact", label: "Contact", icon: <FaPhone className="text-lg" /> },
  ];

  // Memoized click handler for better performance
  const handleButtonClick = useCallback((path) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [navigate, isMobile]);

  // Memoized hover handlers for better performance
  const handleHoverStart = useCallback((id) => {
    if (!isMobile) {
      setHoveredButton(id);
    }
  }, [isMobile]);

  const handleHoverEnd = useCallback(() => {
    if (!isMobile) {
      setHoveredButton(null);
    }
  }, [isMobile]);

  // Desktop Side Dock
  if (!isMobile) {
    return (
      <motion.div 
        className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl p-3 border border-green-200/50 shadow-xl z-50"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-4 p-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
            <FaUtensils className="text-lg text-white" />
          </div>
        </motion.div>

        {buttons.map((button) => {
          const isActive = location.pathname === button.id;
          return (
            <motion.div
              key={button.id}
              className="relative my-2"
              onHoverStart={() => handleHoverStart(button.id)}
              onHoverEnd={handleHoverEnd}
              animate={{
                scale: hoveredButton === button.id ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }}
            >
              <motion.button
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
                whileHover={{ 
                  y: -3,
                }}
                whileTap={{ 
                  scale: 0.95,
                }}
                transition={{ 
                  duration: 0.15,
                  ease: "easeOut"
                }}
                onClick={() => handleButtonClick(button.id)}
              >
                {button.icon}
              </motion.button>
              
              {/* Tooltip */}
              {hoveredButton === button.id && (
                <motion.div
                  className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-green-800 text-white text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {button.label}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-green-800 rotate-45"></div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Mobile Bottom Navigation Bar
  return (
    <>
      {/* Mobile menu toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg z-50"
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </motion.button>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl z-50 p-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-center items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <FaUtensils className="text-lg text-white" />
                </div>
                <span className="ml-2 font-semibold text-green-800">FoodShare</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {buttons.map((button) => {
                  const isActive = location.pathname === button.id;
                  return (
                    <motion.button
                      key={button.id}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors duration-200 ${
                        isActive
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                          : "bg-green-50 text-green-700"
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleButtonClick(button.id)}
                    >
                      <div className="text-xl mb-1">{button.icon}</div>
                      <span className="text-xs font-medium">{button.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Always visible mobile bottom bar indicator */}
      {!mobileMenuOpen && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );
};

export default React.memo(FoodShareSideDock);  


// import React, { useState, useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaHome, FaInfoCircle, FaHandHoldingHeart, FaPhone, FaUtensils, FaBars, FaTimes, FaUser, FaSignInAlt } from "react-icons/fa";

// const FoodShareSideDock = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [hoveredButton, setHoveredButton] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // Check screen size and update isMobile state
//   useEffect(() => {
//     const checkScreenSize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width <= 768);
//       setIsTablet(width > 768 && width <= 1024);
//     };
    
//     // Initial check
//     checkScreenSize();
    
//     // Add event listener
//     window.addEventListener('resize', checkScreenSize);
    
//     // Clean up
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   // Handle scroll for mobile header
//   useEffect(() => {
//     if (!isMobile) return;
    
//     const handleScroll = () => {
//       const isScrolled = window.scrollY > 20;
//       setScrolled(isScrolled);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [isMobile]);

//   const buttons = [
//     { id: "/", label: "Home", icon: <FaHome className="text-lg md:text-xl" /> },
//     { id: "/about", label: "About", icon: <FaInfoCircle className="text-lg md:text-xl" /> },
//     { id: "/donate", label: "Donate", icon: <FaHandHoldingHeart className="text-lg md:text-xl" /> },
//     { id: "/contact", label: "Contact", icon: <FaPhone className="text-lg md:text-xl" /> },
//   ];

//   // Memoized click handler for better performance
//   const handleButtonClick = useCallback((path) => {
//     navigate(path);
//     if (isMobile) {
//       setMobileMenuOpen(false);
//     }
//   }, [navigate, isMobile]);

//   // Memoized hover handlers for better performance
//   const handleHoverStart = useCallback((id) => {
//     if (!isMobile) {
//       setHoveredButton(id);
//     }
//   }, [isMobile]);

//   const handleHoverEnd = useCallback(() => {
//     if (!isMobile) {
//       setHoveredButton(null);
//     }
//   }, [isMobile]);

//   // Desktop Side Dock for larger screens
//   if (!isMobile && !isTablet) {
//     return (
//       <motion.div 
//         className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl p-3 border border-green-200/50 shadow-xl z-50"
//         initial={{ x: -100, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//       >
//         {/* Logo */}
//         <motion.div 
//           className="flex justify-center mb-4 p-2"
//           whileHover={{ scale: 1.05 }}
//           transition={{ type: "spring", stiffness: 400, damping: 10 }}
//         >
//           <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
//             <FaUtensils className="text-lg text-white" />
//           </div>
//         </motion.div>

//         {buttons.map((button) => {
//           const isActive = location.pathname === button.id;
//           return (
//             <motion.div
//               key={button.id}
//               className="relative my-2"
//               onHoverStart={() => handleHoverStart(button.id)}
//               onHoverEnd={handleHoverEnd}
//               animate={{
//                 scale: hoveredButton === button.id ? 1.1 : 1,
//               }}
//               transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }}
//             >
//               <motion.button
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-200 ${
//                   isActive
//                     ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
//                     : "bg-green-50 text-green-700 hover:bg-green-100"
//                 }`}
//                 whileHover={{ 
//                   y: -3,
//                 }}
//                 whileTap={{ 
//                   scale: 0.95,
//                 }}
//                 transition={{ 
//                   duration: 0.15,
//                   ease: "easeOut"
//                 }}
//                 onClick={() => handleButtonClick(button.id)}
//               >
//                 {button.icon}
//               </motion.button>
              
//               {/* Tooltip */}
//               {hoveredButton === button.id && (
//                 <motion.div
//                   className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-green-800 text-white text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg"
//                   initial={{ opacity: 0, x: -5 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -5 }}
//                   transition={{ duration: 0.15 }}
//                 >
//                   {button.label}
//                   <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-green-800 rotate-45"></div>
//                 </motion.div>
//               )}
//             </motion.div>
//           );
//         })}
//       </motion.div>
//     );
//   }

//   // Tablet and Mobile Navigation
//   return (
//     <>
//       {/* Mobile Header that appears when scrolling up */}
//       <AnimatePresence>
//         {scrolled && isMobile && (
//           <motion.div 
//             className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40 py-3 px-4"
//             initial={{ y: -100 }}
//             animate={{ y: 0 }}
//             exit={{ y: -100 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md mr-2">
//                   <FaUtensils className="text-sm text-white" />
//                 </div>
//                 <span className="font-semibold text-green-800">FoodShare</span>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button className="p-2 rounded-full bg-green-100 text-green-700">
//                   <FaUser className="text-sm" />
//                 </button>
//                 <button className="p-2 rounded-full bg-green-100 text-green-700">
//                   <FaSignInAlt className="text-sm" />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Tablet Top Navigation Bar */}
//       {isTablet && (
//         <motion.div 
//           className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl py-3 px-6 border-b border-green-100 shadow-md z-50"
//           initial={{ y: -100 }}
//           animate={{ y: 0 }}
//           transition={{ duration: 0.4 }}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md mr-3">
//                 <FaUtensils className="text-lg text-white" />
//               </div>
//               <span className="text-xl font-bold text-green-800">FoodShare</span>
//             </div>
            
//             <div className="flex items-center space-x-1">
//               {buttons.map((button) => {
//                 const isActive = location.pathname === button.id;
//                 return (
//                   <motion.button
//                     key={button.id}
//                     className={`flex items-center px-4 py-2 rounded-xl mx-1 transition-colors duration-200 ${
//                       isActive
//                         ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
//                         : "bg-green-50 text-green-700 hover:bg-green-100"
//                     }`}
//                     whileHover={{ y: -2 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleButtonClick(button.id)}
//                   >
//                     <span className="mr-2">{button.icon}</span>
//                     <span className="text-sm font-medium">{button.label}</span>
//                   </motion.button>
//                 );
//               })}
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <motion.button
//                 className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium"
//                 whileHover={{ y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaUser className="mr-2" />
//                 <span>Profile</span>
//               </motion.button>
//               <motion.button
//                 className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl font-medium"
//                 whileHover={{ y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaSignInAlt className="mr-2" />
//                 <span>Login</span>
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Mobile menu toggle button - FIXED ANIMATION ISSUE */}
//       {isMobile && (
//         <motion.button
//           className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg z-50"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           animate={{ 
//             rotate: mobileMenuOpen ? 90 : 0
//           }}
//           transition={{ duration: 0.2 }}
//           style={{ backgroundColor: mobileMenuOpen ? "#ef4444" : "" }}
//         >
//           {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
//         </motion.button>
//       )}

//       {/* Mobile navigation overlay */}
//       <AnimatePresence>
//         {mobileMenuOpen && isMobile && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileMenuOpen(false)}
//             />
            
//             <motion.div
//               className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-2xl rounded-t-3xl shadow-2xl z-50 p-5 pb-8"
//               initial={{ y: "100%" }}
//               animate={{ y: 0 }}
//               exit={{ y: "100%" }}
//               transition={{ type: "spring", damping: 20, stiffness: 300 }}
//             >
//               {/* Swipe indicator */}
//               <div className="flex justify-center mb-4">
//                 <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
//               </div>
              
//               <div className="flex justify-center items-center mb-6">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md mr-3">
//                   <FaUtensils className="text-lg text-white" />
//                 </div>
//                 <span className="text-xl font-bold text-green-800">FoodShare</span>
//               </div>
              
//               <div className="grid grid-cols-4 gap-2 mb-6">
//                 {buttons.map((button) => {
//                   const isActive = location.pathname === button.id;
//                   return (
//                     <motion.button
//                       key={button.id}
//                       className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors duration-200 ${
//                         isActive
//                           ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
//                           : "bg-green-50 text-green-700"
//                       }`}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleButtonClick(button.id)}
//                     >
//                       <div className="text-xl mb-1">{button.icon}</div>
//                       <span className="text-xs font-medium">{button.label}</span>
//                     </motion.button>
//                   );
//                 })}
//               </div>
              
//               {/* Additional action buttons */}
//               <div className="border-t border-gray-100 pt-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <motion.button
//                     className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-xl font-medium"
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FaUser className="mr-2" />
//                     <span>Profile</span>
//                   </motion.button>
//                   <motion.button
//                     className="flex items-center justify-center p-3 bg-green-500 text-white rounded-xl font-medium"
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FaSignInAlt className="mr-2" />
//                     <span>Login</span>
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Always visible mobile bottom bar indicator */}
//       {isMobile && !mobileMenuOpen && (
//         <motion.div 
//           className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-500 z-30"
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.3 }}
//         />
//       )}
//     </>
//   );
// };

// export default React.memo(FoodShareSideDock);