import React, { useState } from "react";
import { 
  Phone, Mail, MapPin, ShieldCheck, 
  Send, MessageCircle, User, Type, MessageSquare 
} from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Add your API logic here
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        
        {/* LEFT SECTION: Info & Quick Action */}
        <div className="contact-info-panel">
          <div className="info-header">
            <h2>Need Help? 👋</h2>
            <p>Call us directly or send a message. We speak your language!</p>
          </div>

          <div className="action-cards">
            {/* CALL CARD - Best for low literacy */}
            <a href="tel:+919876543210" className="action-card call">
              <div className="contact-icon-circle"><Phone size={24} /></div>
              <div>
                <p className="label">Call Us Directly</p>
                <p className="value">+91 98765 43210</p>
              </div>
            </a>

            {/* WHATSAPP CARD - Highly User Friendly */}
            <a href="https://wa.me/919876543210" className="action-card whatsapp">
              <div className="contact-icon-circle"><MessageCircle size={24} /></div>
              <div>
                <p className="label">WhatsApp Us</p>
                <p className="value">Chat with Support</p>
              </div>
            </a>
          </div>

          <div className="secondary-info">
            <div className="info-item">
              <MapPin size={20} className="info-icon" />
              <span>Office: New Delhi, India</span>
            </div>
            <div className="info-item">
              <Mail size={20} className="info-icon" />
              <span>support@labourhub.com</span>
            </div>
            <div className="info-item">
              <ShieldCheck size={20} className="info-icon" />
              <span>100% Safe & Secure Platform</span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: The Form */}
        <div className="contact-form-panel">
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3 className="contact-h3">Message Sent!</h3>
              <p>We will call you back within 24 hours.</p>
              <button onClick={() => setSubmitted(false)}>Send another</button>
            </div>
          ) : (
            <>
              <h3 className="contact-h3">Write to Us</h3>
              <form className="modern-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="Your Name" required />
                </div>

                <div className="input-group">
                  <Phone className="input-icon" size={18} />
                  <input type="tel" placeholder="Your Mobile Number" required />
                </div>

                <div className="input-group">
                  <Type className="input-icon" size={18} />
                  <input type="text" placeholder="Subject (e.g. Need a job)" />
                </div>

                <div className="input-group">
                  <MessageSquare className="input-icon message" size={18} />
                  <textarea placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;