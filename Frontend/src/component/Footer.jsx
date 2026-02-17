import React from 'react';
import { Link } from "react-router-dom";
import "./Footer.css";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">Labour Hub</h2>
          <p className="footer-text">
            Connecting workers with daily wage jobs easily and safely.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/find-work">Find Work</Link></li>
            <li><Link to="/post">Post Job</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Safety Tips</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 India</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ support@labourhub.com</p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Labour Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer