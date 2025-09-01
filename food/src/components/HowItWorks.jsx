import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaLeaf, FaHandshake, FaChartLine, FaArrowRight, FaArrowDown } from "react-icons/fa";

const steps = [
  {
    title: "List Your Surplus Food",
    desc: "Snap a photo of your excess food, add details like quantity and preparation time, and set your location. Our app makes it quick and simple—just a few taps to make a difference.",
    icon: <FaLeaf className="text-2xl" />,
    details: "Whether it's leftover catering, extra restaurant meals, or unused groceries, you can easily share what you have with those in need.",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Connect With Local NGOs",
    desc: "Our system automatically matches your donation with verified NGOs and volunteers in your area. See their ratings and choose who you'd like to help with your contribution.",
    icon: <FaHandshake className="text-2xl" />,
    details: "We partner with trusted organizations that follow strict food safety protocols to ensure your donation reaches people safely and respectfully.",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Schedule Pickup & Track Impact",
    desc: "Coordinate a convenient pickup time and receive notifications throughout the process. Plus, get updates on how your donation helped feed people in your community.",
    icon: <FaChartLine className="text-2xl" />,
    details: "Every donation creates a ripple effect. Track your personal impact through our dashboard that shows meals shared and carbon footprint reduced.",
    color: "from-purple-400 to-fuchsia-500",
    bgColor: "bg-purple-50"
  },
];

const HowItWorks = () => {
  const [expandedStep, setExpandedStep] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const stepRefs = [useRef(null), useRef(null), useRef(null)];
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });
  const step1InView = useInView(stepRefs[0], { once: true, amount: 0.4 });
  const step2InView = useInView(stepRefs[1], { once: true, amount: 0.4 });
  const step3InView = useInView(stepRefs[2], { once: true, amount: 0.4 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <section 
      className="py-20 bg-gradient-to-b from-green-25 to-white relative overflow-hidden" 
      id="how-it-works"
      ref={sectionRef}
    >
      {/* Simplified background elements for better performance */}
      <div className="absolute -top-40 -right-40 w-60 h-60 bg-green-200/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 -left-40 w-60 h-60 bg-blue-200/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-200/10 rounded-full blur-xl"></div>

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        {/* Heading with optimized animation */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            How <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turning your surplus food into meals for those in need is simple, safe, and rewarding. 
          </p>
        </motion.div>

        {/* Steps with optimized animations */}
        <div className="grid md:grid-cols-3 gap-6 relative mb-16">
          {/* Connecting line */}
          <div className="hidden md:flex absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full z-0"></div>
          
          {steps.map((step, i) => {
            const isInView = 
              (i === 0 && step1InView) || 
              (i === 1 && step2InView) || 
              (i === 2 && step3InView);
              
            return (
              <motion.div
                key={i}
                ref={stepRefs[i]}
                className="relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              >
                {/* Step number */}
                <motion.div 
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-r ${step.color} text-white font-bold rounded-full shadow-md z-20`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {i + 1}
                </motion.div>
                
                <motion.div
                  className="bg-white/95 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4 shadow-sm`}>
                    {step.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">{step.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 flex-grow text-sm">{step.desc}</p>
                  
                  {/* Learn more toggle */}
                  <button 
                    onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                    className={`text-sm font-medium transition-colors ${expandedStep === i ? 'text-gray-700' : 'text-green-600 hover:text-green-800'}`}
                  >
                    {expandedStep === i ? 'Show less' : 'Learn more'} 
                    <motion.span
                      animate={{ rotate: expandedStep === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-1 inline-block"
                    >
                      <FaArrowDown size={12} />
                    </motion.span>
                  </button>
                  
                  {/* Expanded details */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: expandedStep === i ? 1 : 0,
                      height: expandedStep === i ? 'auto' : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-3 p-3 ${step.bgColor} rounded-lg text-left text-sm`}>
                      <p className="text-gray-700">{step.details}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
       
      </div>
    </section>
  );
};

export default HowItWorks;