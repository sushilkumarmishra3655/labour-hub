import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-wrapper">
      <div className="contact-card-modern">

        {/* Left Section */}
        <div className="contact-left">
          <h2>Let’s Talk 👋</h2>
          <p className="contact-subtitle">
            Have questions about jobs, hiring workers, or using Labour Hub?
            We’d love to hear from you.
          </p>

          <div className="contact-details">
            <div className="detail-box">
              <span>📍</span>
              <div>
                <h4>Office Location</h4>
                <p>India (All States Supported)</p>
              </div>
            </div>

            <div className="detail-box">
              <span>📞</span>
              <div>
                <h4>Call Us</h4>
                <p>+91 98765 43210</p>
                <small>Mon–Sat, 9 AM – 7 PM</small>
              </div>
            </div>

            <div className="detail-box">
              <span>✉️</span>
              <div>
                <h4>Email Support</h4>
                <p>support@labourhub.com</p>
                <small>We reply within 24 hours</small>
              </div>
            </div>

            <div className="detail-box">
              <span>🛡️</span>
              <div>
                <h4>Trusted Platform</h4>
                <p>Verified jobs & safe hiring</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="contact-right">
          <h3>Send us a Message</h3>

          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
            </div>

            <input type="text" placeholder="Phone Number" />
            <input type="text" placeholder="Subject" />

            <textarea placeholder="Tell us how we can help you..."></textarea>

            <button type="submit">Submit Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;