import React from "react";

const ContactSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-6" id="contact">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-10">
          Have questions, suggestions, or want to collaborate?  
          Fill out the form below and we’ll get back to you soon.
        </p>

        {/* Form */}
        <form className="bg-white shadow-md rounded-xl p-6 md:p-10 space-y-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          ></textarea>

          <button
            type="submit"
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-12 text-gray-700">
          <p>Email: <span className="font-medium">support@foodshare.org</span></p>
          <p>Phone: <span className="font-medium">+91 98765 43210</span></p>
          <p>Location: <span className="font-medium">Bhopal, India</span></p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
