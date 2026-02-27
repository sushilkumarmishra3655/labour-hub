// src/component/Logo.jsx

import React from "react";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="logo-container">
      <img src="/people-icon.png" alt="Labour Hub" className="logo-icon" />

      <div className="logo-text-wrap">
        <h1 className="logo-title">
          <span className="logo-labour">Labour</span>{" "}
          <span className="logo-hub">Hub</span>
        </h1>
        <span className="logo-tag">Worker Hiring Platform</span>
      </div>
    </div>
  );
};

export default Logo;