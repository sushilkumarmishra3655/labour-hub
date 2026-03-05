import React from "react";
import {
  Smartphone, UserCheck, PhoneCall,
  ShieldCheck, Zap, Star, MapPin,
  Users, Briefcase, Award
} from "lucide-react";
import "./LandingSections.css";

const LandingSections = () => {
  return (
    <div className="landing-wrapper">

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works section">
        <div className="container">
          <div className="text-center section-header">
            <span className="badge">Easy Process</span>
            <h2 className="section-title-landing">How It Works</h2>
            <p className="section-desc">
              Finding work or hiring help is now as easy as 1-2-3.
            </p>
          </div>

          <div className="process-grid">

            <div className="process-card">
                <span className="step-num">1</span>
              <div className="landing-icon-circle">
                <Smartphone size={32}/>
                
              </div>
              <h3 className="process-h3">Register</h3>
              <p>Sign up quickly with your phone number.</p>
            </div>

            <div className="process-card">
                <span className="step-num">2</span>
              <div className="landing-icon-circle">
                <UserCheck size={32}/>
                
              </div>
              <h3 className="process-h3">Connect</h3>
              <p>Find jobs near you or post work instantly.</p>
            </div>

            <div className="process-card">
                <span className="step-num">3</span>
              <div className="landing-icon-circle">
                <PhoneCall size={32}/>
                
              </div>
              <h3 className="process-h3">Work & Earn</h3>
              <p>Connect, complete the job and get paid safely.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features section">
        <div className="container feature-layout">

          <div className="feature-content">
            <span className="badge">Why Us?</span>
            <h2 className="main-heading">
              Trust & Safety <br/> <span>is our priority</span>
            </h2>

            <div className="feature-list">

              <div className="feature-item">
                <div className="f-icon"><ShieldCheck/></div>
                <div>
                  <h4>Verified Profiles</h4>
                  <p>All workers and employers are verified for safety.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="f-icon"><Zap/></div>
                <div>
                  <h4>Zero Fees</h4>
                  <p>No commission. Workers keep 100% earnings.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="f-icon"><MapPin/></div>
                <div>
                  <h4>Local Jobs</h4>
                  <p>Find work in your nearby location easily.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="feature-visual">
            <div className="image-stack">
              <img src="\Landing.jpeg" alt="Worker" className="main-img"/>
            </div>
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats-strip">
        <div className="container stats-grid">

          <div className="landing-stat-card">
            <div className="stat-icon"><Users/></div>
            <div>
              <h3 className="stat-number">5,000+</h3>
              <p className="stat-label">Registered Workers</p>
            </div>
          </div>

          <div className="landing-stat-card">
            <div className="stat-icon"><Briefcase/></div>
            <div>
              <h3 className="stat-number">1,200+</h3>
              <p className="stat-label">Daily Job Posts</p>
            </div>
          </div>

          <div className="landing-stat-card">
            <div className="stat-icon"><Star/></div>
            <div>
              <h3 className="stat-number">4.8/5</h3>
              <p className="stat-label">User Rating</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingSections;