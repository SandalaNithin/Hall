import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Main from "../assets/Main.jpg";
import SEOWrapper from '../components/SEOWrapper';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOWrapper
        title="Contact Us"
        description="Get in touch with Lakshmi Function Hall in BuchiReddyPalem to book your event. Phone, email, and location details."
      />

      {/* Hero Header */}
      <div className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Image Grid */}
            <div className="w-full md:w-1/2 flex items-center justify-center gap-4">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                <img src={Main} alt="Hall Exterior" className="w-full h-full object-cover" />
              </div>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg mt-12 transform rotate-3 hover:rotate-0 transition-transform bg-gray-200">
                {/* Placeholder for secondary image */}
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                  Event Setup Image
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Plan Your Perfect Event <span className="text-indigo-600">With Us</span>
              </h1>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Thank you for considering Lakshmi Function Hall. Our team is ready to assist you with pricing, availability, and tour scheduling.
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Book Online Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info & Map */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get In Touch</h2>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Contact Details */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-md flex items-center gap-6 hover:shadow-lg transition">
              <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Phone</p>
                <a href="tel:7981862253" className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition">
                  +91 79818 62253
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md flex items-center gap-6 hover:shadow-lg transition">
              <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Email</p>
                <a href="mailto:Lakshmifunctionhall@gmail.com" className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition break-all">
                  Lakshmifunctionhall@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md flex items-center gap-6 hover:shadow-lg transition">
              <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Address</p>
                <p className="text-lg font-medium text-gray-900">
                  Ramakrishnanager, BuchiReddyPalem,<br /> Nellore, A.P., India
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="w-full lg:w-1/2 h-[500px] bg-white p-4 rounded-2xl shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.610667!2d79.875!3d14.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4c922a8a8209b3%3A0x8a1a4e32b6e4c59e!2sS%20S%20Kalyana%20Mandapam!5e0!3m2!1sen!2sin!4v1761805294698!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Send Us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format phone number to only digits
    if (name === "phone") {
      setFormData(prev => ({
        ...prev,
        [name]: value.replace(/\D/g, "").slice(0, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/email/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending contact form:", err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 font-medium">
                Thank you for contacting us! We'll get back to you soon.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="9876543210"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Tell us about your event requirements..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}