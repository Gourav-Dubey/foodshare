import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Heart, Globe, Utensils, Target, Clock, MapPin, Star, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const stats = [
  { label: "Meals Shared", value: "2.5M+", icon: <Utensils className="w-8 h-8 text-green-600" />, description: "Nutritious meals delivered to those in need" },
  { label: "Volunteers", value: "25,000+", icon: <Users className="w-8 h-8 text-green-600" />, description: "Dedicated individuals making a difference" },
  { label: "Cities Worldwide", value: "120+", icon: <MapPin className="w-8 h-8 text-green-600" />, description: "Across 6 continents" },
  { label: "NGO Partners", value: "850+", icon: <Globe className="w-8 h-8 text-green-600" />, description: "Trusted organizations in our network" },
];

const team = [
  { 
    name: "Gourav Dubey", 
    role: "Founder & Visionary", 
    img: "6.jpg",
    bio: "Former restaurant owner who saw food waste firsthand and decided to make a change.",
    social: { linkedin: "#", twitter: "#" }
  },
  { 
    name: "Manish Tiwari", 
    role: "Operations Director", 
    img: "",
    bio: "Logistics expert with 10+ years in supply chain management for humanitarian organizations.",
    social: { linkedin: "#", twitter: "#" }
  },
  { 
    name: "Mayank Tiwari", 
    role: "Technology Lead", 
    img: "",
    bio: "Software engineer passionate about using technology to solve real-world problems.",
    social: { linkedin: "#", twitter: "#" }
  },
  { 
    name: "Rohit Thakur", 
    role: "Community Manager", 
    img: "",
    bio: "Software Engineer and Social Worker.",
    social: { linkedin: "#", twitter: "#" }
  },
];

const timeline = [
  { year: "2025", event: "Concept Born", description: "Idea sparked after witnessing food waste at local events" },
  { year: "2025", event: "Pilot Launch", description: "First successful food sharing in Mumbai with 5 NGO partners" },
  { year: "2025", event: "Tech Platform", description: "Website launched to scale operations" },
  { year: "2025", event: "National Expansion", description: "Expanded to 15 cities across India" },
  { year: "2025", event: "Global Reach", description: "Went international with operations in 6 countries" },
];

const values = [
  { 
    title: "Compassion", 
    icon: <Heart className="w-10 h-10 text-red-500" />,
    description: "We lead with empathy in all our interactions, recognizing the dignity in every person we serve."
  },
  { 
    title: "Innovation", 
    icon: <Target className="w-10 h-10 text-blue-500" />,
    description: "We continuously seek better solutions to complex problems of food distribution and waste reduction."
  },
  { 
    title: "Sustainability", 
    icon: <Globe className="w-10 h-10 text-green-500" />,
    description: "We build systems that create lasting change rather than temporary fixes."
  },
  { 
    title: "Community", 
    icon: <Users className="w-10 h-10 text-purple-500" />,
    description: "We believe in the power of collective action and diverse partnerships."
  },
];

const testimonials = [
  {
    quote: "Food Share Network helped our shelter reduce food costs by 40% while providing more nutritious meals to our residents.",
    author: "Meera Singh",
    role: "Director, Hope Shelter",
    avatar: "https://i.pravatar.cc/100?img=11"
  },
  {
    quote: "As a restaurant owner, I used to feel guilty about food waste. Now I know exactly where my excess food is going and who it's helping.",
    author: "Rajiv Malhotra",
    role: "Owner, Spice Garden Restaurant",
    avatar: "https://i.pravatar.cc/100?img=12"
  },
  {
    quote: "Volunteering with Food Share Network has been the most rewarding experience. The app makes it so easy to coordinate pickups.",
    author: "Aisha Khan",
    role: "Volunteer for 2 years",
    avatar: "https://i.pravatar.cc/100?img=13"
  }
];

const AboutUs = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPlaying(false);
  };

  return (
    <div className="bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-500/10 via-white to-blue-500/10 text-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
  <motion.h1
    className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    About <span className="text-green-600">Food Share Network</span>
  </motion.h1>

  <motion.p
    className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.8 }}
  >
    We're building a global movement to eliminate food waste and hunger by connecting surplus food with people in need through technology and community.
  </motion.p>

  <motion.div 
    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
  >
    <Link
      to="/register"
      className="bg-green-600 text-white font-semibold px-8 py-4 rounded-full shadow-md hover:bg-green-700 transition flex items-center justify-center"
    >
      Join Our Mission
    </Link>

    
  </motion.div>
</div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            className="bg-white p-10 rounded-3xl shadow-lg relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="absolute -top-5 left-10 bg-red-100 p-4 rounded-full">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-5 mt-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To create a world where no edible food goes to waste while people go hungry. We're building technology-powered solutions that make it simple and efficient to redirect surplus food to those who need it most.
            </p>
            <div className="mt-8 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <p className="text-red-700 font-medium">"Every meal matters. Every action counts."</p>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white p-10 rounded-3xl shadow-lg relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="absolute -top-5 left-10 bg-blue-100 p-4 rounded-full">
              <Globe className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold mb-5 mt-4">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A future where food waste is eliminated, communities are nourished, and our food systems are sustainable and equitable. We envision a global network where sharing food is as natural as sharing a smile.
            </p>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-700 font-medium">"Connecting compassion with technology to nourish communities."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-green-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-green-500 pattern-size-4 pattern-opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Impact in Numbers
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-5">
                  <div className="p-3 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-green-600 mb-2">{stat.value}</h3>
                <p className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</p>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Environmental Impact</h3>
                <p className="text-gray-600">By reducing food waste, we've prevented approximately 8,500 tons of CO2 emissions—equivalent to taking 1,800 cars off the road for a year.</p>
              </div>
              <div className="bg-green-100 text-green-800 font-bold text-xl px-6 py-4 rounded-lg whitespace-nowrap">
                8,500+ Tons CO2 Saved
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 text-gray-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Journey
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>
          
          {timeline.map((item, i) => (
            <motion.div 
              key={i}
              className={`relative mb-16 flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="w-1/2 px-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="text-xl font-bold text-green-600 mb-2">{item.event}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full border-4 border-white shadow-lg">
                  <span className="text-white font-bold">{item.year}</span>
                </div>
              </div>
              
              <div className="w-1/2 px-8">
                {/* Empty space for alternating sides */}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Values
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-5">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Diverse backgrounds, shared passion for making a difference
          </motion.p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl p-6 text-center transition-all duration-300 group overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="relative mb-5">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What People Say
          </motion.h2>
          
          <div className="relative bg-white rounded-3xl shadow-lg p-10">
            <div className="absolute top-0 left-0 text-green-100 text-9xl font-serif transform -translate-y-8 -translate-x-4">"</div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-xl text-gray-700 italic mb-8 relative z-10">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                
                <div className="flex items-center justify-center">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].author}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].author}</p>
                    <p className="text-green-600">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-10 space-x-4">
              <button onClick={prevTestimonial} className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button onClick={nextTestimonial} className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTestimonial(i);
                    setIsPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full ${i === activeTestimonial ? 'bg-green-600' : 'bg-green-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-18 text-center bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full pattern-food pattern-green-800 pattern-size-16 pattern-opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Make a Difference?
          </motion.h2>
          <motion.p
            className="text-xl mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of individuals and organizations fighting food waste and hunger in communities around the world.
          </motion.p>
          
          
        </div>
      </section>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .pattern-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .pattern-food {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm8-2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm-4 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z' fill='%23000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default AboutUs;