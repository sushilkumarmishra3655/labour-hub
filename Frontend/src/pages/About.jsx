import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-page">
      <div className="about-container">

        <header className="about-header">
          <h1>About Labour Hub</h1>
          <p>
            A modern digital platform for daily wage worker hiring
          </p>
        </header>

        <div className="about-grid">
          <div className="about-card">
            <h3>Who We Are</h3>
            <p>
              Labour Hub is a digital platform that connects daily wage workers
              with employers in a fast, reliable, and transparent way.
            </p>
          </div>

          <div className="about-card">
            <h3>The Problem</h3>
            <p>
              Traditional labour hiring is unorganized and time-consuming.
              Workers struggle to find jobs while employers face trust issues.
            </p>
          </div>

          <div className="about-card">
            <h3>Our Solution</h3>
            <p>
              Labour Hub brings the hiring process online, making job discovery
              and worker hiring simple and efficient.
            </p>
          </div>
        </div>
        <div className="about-mission">
          <div className="mission-card">
            <h3>Our Mission</h3>
            <p>
              To empower daily wage workers and simplify the labour hiring
              process through technology.
            </p>
          </div>

          <div className="mission-card">
            <h3>Our Vision</h3>
            <p>
              To build a trusted and inclusive digital ecosystem for workforce
              employment.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
