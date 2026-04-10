import React, { useState } from "react";
import { 
  Phone, Mail, MapPin, ShieldCheck, 
  Send, MessageCircle, User, Type, MessageSquare,
  Clock, CheckCircle, Smartphone
} from "lucide-react";
import api from "../services/api";
import Swal from "sweetalert2";
import "./Contact.css";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/contact", formData);
      
      if (response.data.success) {
        Swal.fire({
          title: "Message Sent!",
          text: "We have received your query and will contact you within 24 hours.",
          icon: "success",
          confirmButtonColor: "#1E656D",
          customClass: {
            popup: 'premium-swal-popup'
          }
        });
        
        setFormData({
          name: "",
          phone: "",
          subject: "",
          message: ""
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#1E656D"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-bg-pattern"></div>
      
      <div className="contact-container">
        
        {/* LEFT SECTION: Info & Quick Action */}
        <div className="contact-info-panel">
          <div className="info-header">
            <span className="info-badge">Support Center</span>
            <h2>How can we help you? 👋</h2>
            <p>Our team is here to assist you with any questions about jobs or hiring.</p>
          </div>

          <div className="action-cards">
            {/* CALL CARD */}
            <a href="tel:+919876543210" className="action-card call">
              <div className="contact-icon-circle"><Smartphone size={22} /></div>
              <div className="card-content">
                <p className="label">Call Support</p>
                <p className="value">+91 98765 43210</p>
              </div>
            </a>

            {/* WHATSAPP CARD */}
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="action-card whatsapp">
              <div className="contact-icon-circle"><MessageCircle size={22} /></div>
              <div className="card-content">
                <p className="label">WhatsApp</p>
                <p className="value">Chat Online</p>
              </div>
            </a>
          </div>

          <div className="feature-grid">
            <div className="feature-item">
              <Clock size={16} />
              <span>Available 24/7</span>
            </div>
            <div className="feature-item">
              <CheckCircle size={16} />
              <span>Free Assistance</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={16} />
              <span>Data Privacy</span>
            </div>
          </div>

          <div className="secondary-info">
             <div className="contact-item">
                <MapPin size={18} />
                <span>Indore, Madhya Pradesh, India</span>
             </div>
             <div className="contact-item">
                <Mail size={18} />
                <span>support@labourhub.com</span>
             </div>
          </div>
        </div>

        {/* RIGHT SECTION: The Form */}
        <div className="contact-form-panel">
          <div className="form-header">
            <h3>Send a Message</h3>
            <p>Fill the form below and we'll get back to you.</p>
          </div>

          <form className="modern-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="contact-input-icon" size={18} />
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <Phone className="contact-input-icon" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Mobile Number" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <Type className="contact-input-icon" size={18} />
              <input 
                type="text" 
                name="subject"
                placeholder="Subject (Optional)" 
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <MessageSquare className="contact-input-icon message" size={18} />
              <textarea 
                name="message"
                placeholder="Describe your query..." 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Submit Message</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;