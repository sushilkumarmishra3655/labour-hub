import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Briefcase } from "lucide-react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="overlay"></div>

      {/* TOP TRUST BADGE */}
      <div className="hero-top-badge">
        <CheckCircle size={16} />
        <span>India's Most Trusted Labour Hub</span>
      </div>

      {/* MAIN CENTER CONTENT */}
      <div className="hero-content">
        <h1>Find Trusted Daily Wage Workers Near You</h1>

        <p>
          Hire workers or find work easily. Fast, safe and reliable platform
          for daily wage jobs.
        </p>

        <div className="hero-buttons">
          <Link to="/FindWork" className="cta-btn primary">
            Find Work <span className="arrow">🔍</span>
          </Link>

          <Link to="/PostJob" className="cta-btn secondary">
            Post a Job <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;