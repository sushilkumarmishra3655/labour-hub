import React from "react";
import "./About.css";
import { Link } from "react-router-dom";

import { Users, Handshake, Zap } from "lucide-react";

const About = () => {
  return (
    <section className="about-page">
      <div className="about-container">

        {/* Header */}
        <header className="about-hero">
          <div className="hero-badge">Since 2026</div>
          <h1>Helping India Work Better</h1>
          <p className="hero-subtitle">
            We connect hardworking people with honest employers. 
            <strong> Simple. Fast. Secure.</strong>
          </p>
        </header>

        {/* Who / Problem / Solution */}
        <div className="about-grid">

          <div className="about-card glass">
            <Users className="about-icon" size={36} strokeWidth={2.2} />
            <h3 className="about-h3">Who We Are</h3>
            <p>
              Labour Hub is a modern digital platform connecting daily wage
              workers with employers in a fast, secure, and transparent way.
            </p>
          </div>

          <div className="about-card glass">
            <Handshake className="about-icon" size={36} strokeWidth={2.2} />
            <h3 className="about-h3">The Problem</h3>
            <p>
              Traditional hiring is unorganized and slow. Workers struggle to
              find jobs and employers face trust and availability issues.
            </p>
          </div>

          <div className="about-card glass">
            <Zap className="about-icon" size={36} strokeWidth={2.2} />
            <h3 className="about-h3">Our Solution</h3>
            <p>
              We bring hiring online with instant job posting, worker discovery,
              and quick communication.
            </p>
          </div>

        </div>

        {/* Mission & Vision */}
        <div className="about-mission">
          <div className="mission-card gradient">
            <h3 className="about-h3">🚀 Our Mission</h3>
            <p>
              Empower daily wage workers with opportunities and make hiring
              simple, fast, and reliable using technology.
            </p>
          </div>

          <div className="mission-card gradient">
            <h3 className="about-h3">🌍 Our Vision</h3>
            <p>
              Build India's most trusted digital ecosystem for workforce hiring.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          <div className="stat-box">
            <h2>1000+</h2>
            <p>Workers Registered</p>
          </div>

          <div className="stat-box">
            <h2>500+</h2>
            <p>Jobs Posted</p>
          </div>

          <div className="stat-box">
            <h2>300+</h2>
            <p>Employers Joined</p>
          </div>

          <div className="stat-box">
            <h2>24/7</h2>
            <p>Support System</p>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2>Join Labour Hub Today</h2>
          <p>Start hiring or start earning in just a few clicks</p>

          <div className="cta-buttons">
            <Link to="/FindWork" className="btn primary">
              <span>Find Work</span>
              <small>Apply jobs easily</small>
            </Link>

            <Link to="/PostJob" className="btn secondary">
              <span>Post a Job</span>
              <small>Hire workers quickly</small>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;