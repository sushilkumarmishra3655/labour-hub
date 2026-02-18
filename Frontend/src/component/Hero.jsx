import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Trusted Daily Wage Workers Near You</h1>
          <p>
            Hire workers or find work easily. Fast, safe and reliable platform
            for daily wage jobs.
          </p>

          <div className="hero-buttons">
            <Link to="/FindWork" className="cta-btn primary">
              Find Work <span className="arrow">→</span>
            </Link>

            <Link to="/PostJob" className="cta-btn secondary">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="trust-strip">
        <div>👷 10,000+ Workers</div>
        <div>🏢 2,500+ Employers</div>
        <div>🛠 50+ Job Types</div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works">
        <h2>How Labour Hub Works</h2>

        <div className="steps">
          <div className="step-card">
            <h3>1. Post a Job</h3>
            <p>
              Employers post daily wage jobs with wage and work details.
            </p>
          </div>

          <div className="step-card">
            <h3>2. Find Workers</h3>
            <p>
              Workers can explore jobs and apply instantly.
            </p>
          </div>

          <div className="step-card">
            <h3>3. Get Work & Get Paid</h3>
            <p>
              Connect directly and complete work with secure payment.
            </p>
          </div>
        </div>
      </section>

      {/* ================= JOB CATEGORIES ================= */}
      <section className="categories">
        <h2>Job Categories</h2>
        <p className="category-subtitle">
          Explore jobs by category and find work near you
        </p>

        <div className="category-grid">
          <Link to="/find-work" className="category-card">
            <h3>🏗 Construction</h3>
            <p>Mason, Painter, Labour</p>
          </Link>

          <Link to="/find-work" className="category-card">
            <h3>🧰 Helper</h3>
            <p>Factory Helper, Carpenter, Helper</p>
          </Link>

          <Link to="/find-work" className="category-card">
            <h3>🏭 Factory</h3>
            <p>Machine Worker, Loader</p>
          </Link>

          <Link to="/find-work" className="category-card">
            <h3>🔌 Electrician / Plumber</h3>
            <p>Repair & Maintenance</p>
          </Link>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-us">
        <h2 className="section-title">Why Choose Labour Hub</h2>

        <div className="why-grid">

          <div className="why-card">
            <span className="why-icon">⚡</span>
            <h3>Fast Hiring</h3>
            <p>Get workers within minutes for daily wage jobs.</p>
          </div>

          <div className="why-card">
            <span className="why-icon">✔</span>
            <h3>Verified Workers</h3>
            <p>All workers are verified and trusted.</p>
          </div>

          <div className="why-card">
            <span className="why-icon">🔒</span>
            <h3>Secure Payments</h3>
            <p>Safe and transparent payment system.</p>
          </div>

          <div className="why-card">
            <span className="why-icon">📱</span>
            <h3>Easy to Use</h3>
            <p>Simple and user-friendly interface.</p>
          </div>

        </div>
      </section>
    </>
  );
};

export default Hero;
