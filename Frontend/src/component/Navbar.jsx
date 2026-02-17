import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate + Close dropdown
  const handleNavigate = (path) => {
    setOpen(false);     // 👈 close dropdown
    navigate(path);     // 👈 navigate
  };

  return (
    <nav className="navbar">
      <div className="logos">
        <img src={logo} alt="Labour Hub Logo" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/FindWork">Find Work</Link></li>
        <li><Link to="/PostJob">Post Job</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {/* ACCOUNT */}
        <li className="account-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="account-btn"
            onClick={() => setOpen(prev => !prev)}
          >
            <span>Account</span>
            <span className={`caret ${open ? "open" : ""}`}>▾</span>
          </button>

          {open && (
            <div className="account-dropdown">

              {!user.isLoggedIn && (
                <>
                  <div onClick={() => handleNavigate("/login")}>Login</div>
                  <div onClick={() => handleNavigate("/register")}>Register</div>
                </>
              )}

              {(user.role === "worker" || user.role === "admin") && (
                <div onClick={() => handleNavigate("/worker-dashboard")}>
                  Worker Dashboard
                </div>
              )}

              {(user.role === "employer" || user.role === "admin") && (
                <div onClick={() => handleNavigate("/employer-dashboard")}>
                  Employer Dashboard
                </div>
              )}

              {user.role === "admin" && (
                <div onClick={() => handleNavigate("/admin-dashboard")}>
                  Admin Dashboard
                </div>
              )}

            </div>
          )}

        </li>

        <li>
          <Link to="/login" className="login-btn">
            <span className="a">JOIN US</span>
            <span>Click To Sign Up</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
