import React from 'react';
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  Home,Briefcase,PlusCircle,LogIn,HelpCircle,ShieldCheck,FileText,Lock,MapPin,Phone,Mail
} from "lucide-react";

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
          <h3 className='footer-h3'>Quick Links</h3>
          <ul>
            <li><Link to="/"><Home size={16}/> Home</Link></li>
            <li><Link to="/FindWork"><Briefcase size={16}/> Find Work</Link></li>
            <li><Link to="/PostJob"><PlusCircle size={16}/> Post Job</Link></li>
            <li><Link to="/login"><LogIn size={16}/> Login</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3 className='footer-h3'> Support</h3>
          <ul>
            <li><HelpCircle size={16}/> Help Center</li>
            <li><ShieldCheck size={16}/> Safety Tips</li>
            <li><FileText size={16}/> Terms & Conditions</li>
            <li><Lock size={16}/> Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3 className='footer-h3'>Contact</h3>
          <p><MapPin size={16}/> India</p>
          <p><Phone size={16}/> +91 98765 43210</p>
          <p><Mail size={16}/> support@labourhub.com</p>
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