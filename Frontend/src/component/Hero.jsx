import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Trusted Daily Wage Workers Near You</h1>
          <p>
            Hire workers or find work easily. Fast, safe and reliable platform
            for daily wage jobs.
          </p>

          <div className="hero-buttons">
            <Link to="/FindWork" className="btn primary">
              Find Work
            </Link>

            <Link to="/PostJob" className="btn secondary">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2>How Labour Hub Works</h2>

        <div className="steps">
          <div className="step-card">
            <h3>1. Post a Job</h3>
            <p>
              Employers post daily wage jobs with location, wage and work
              details.
            </p>
          </div>

          <div className="step-card">
            <h3>2. Find Workers</h3>
            <p>
              Workers nearby can view jobs and apply instantly.
            </p>
          </div>

          <div className="step-card">
            <h3>3. Get Work / Get Paid</h3>
            <p>
              Connect directly and complete the work with transparent payment.
            </p>
          </div>
        </div>
      </section>
      {/* JOB CATEGORIES SECTION */}
      <section className="categories">
        <h2>Job Categories</h2>
        <p className="category-subtitle">
          Explore jobs by category and find work near you
        </p>

        <div className="category-grid">
          <a href="/find-work" className="category-card">
            <h3>Construction</h3>
            <p>Mason, Painter, Labour</p>
          </a>

          <a href="/find-work" className="category-card">
            <h3>Helper</h3>
            <p>Factory Helper, Carpenter, Helper</p>
          </a>

          <a href="/find-work" className="category-card">
            <h3>Factory</h3>
            <p>Machine Worker, Loader</p>
          </a>

          <a href="/find-work" className="category-card">
            <h3>Electrician / Plumber</h3>
            <p>Repair & Maintenance</p>
          </a>
        </div>
      </section>

    </>
  );
};

export default Hero;

