import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const goDashboard = () => {

    if (user.role === "worker") navigate("/worker-dashboard");
    else if (user.role === "employer") navigate("/employer-dashboard");
    else if (user.role === "admin") navigate("/admin-dashboard");

    setOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="logos">
        <Logo />
      </div>

      <ul className="nav-links">

        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* NOT LOGGED IN → SHOW BOTH */}
        {!user?.isLoggedIn && (
          <>
            <li><Link to="/FindWork">Find Work</Link></li>
            <li><Link to="/PostJob">Post Job</Link></li>
          </>
        )}

        {/* WORKER */}
        {user?.isLoggedIn && user.role === "worker" && (
          <li><Link to="/FindWork">Find Work</Link></li>
        )}

        {/* EMPLOYER */}
        {user?.isLoggedIn && user.role === "employer" && (
          <li><Link to="/PostJob">Post Job</Link></li>
        )}

        {/* ADMIN */}
        {user?.isLoggedIn && user.role === "admin" && (
          <>
            <li><Link to="/FindWork">Find Work</Link></li>
            <li><Link to="/PostJob">Post Job</Link></li>
          </>
        )}

        <li><Link to="/contact">Contact</Link></li>

        {/* PROFILE / LOGIN */}
        {user?.isLoggedIn ? (

          <li className="profile-menu" ref={dropdownRef}>

            <button
              className="profile-btn"
              onClick={() => setOpen(!open)}
            >

              <div className="profile-avatar-letter">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <span className="profile-name">
                {user.name}
              </span>

              <span className={`caret ${open ? "open" : ""}`}>
                ▾
              </span>

            </button>

            {open && (

              <div className="profile-dropdown">

                <div onClick={goDashboard}>
                  Dashboard
                </div>

                <div
                  className="logout-option"
                  onClick={handleLogout}
                >
                  Logout
                </div>

              </div>

            )}

          </li>

        ) : (

          <li>
            <Link
              to="/login"
              state={{ from: window.location.pathname }}
              className="login-btn"
            >
              <span className="top-text">JOIN US</span>
              <span className="bottom-text">Click to Sign Up</span>
            </Link>
          </li>

        )}

      </ul>
    </nav>
  );
};

export default Navbar;