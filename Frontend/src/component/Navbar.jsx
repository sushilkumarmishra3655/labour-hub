import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);   // 👈 logout add
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
    setOpen(false);
    navigate(path);
  };

  // 🚪 Logout handler
  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logos">
        <Logo />
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

              {/* ❌ NOT LOGGED IN */}
              {!user.isLoggedIn && (
                <>
                  <div onClick={() => handleNavigate("/login")}>Login</div>
                  <div onClick={() => handleNavigate("/register")}>Register</div>
                </>
              )}

              {/* 👷 WORKER */}
              {(user.role === "worker" || user.role === "admin") && (
                <div onClick={() => handleNavigate("/worker-dashboard")}>
                  Worker Dashboard
                </div>
              )}

              {/* 🏢 EMPLOYER */}
              {(user.role === "employer" || user.role === "admin") && (
                <div onClick={() => handleNavigate("/employer-dashboard")}>
                  Employer Dashboard
                </div>
              )}

              {/* 👑 ADMIN */}
              {user.role === "admin" && (
                <div onClick={() => handleNavigate("/admin-dashboard")}>
                  Admin Dashboard
                </div>
              )}

              {/* 🚪 LOGOUT */}
              {user.isLoggedIn && (
                <div className="logout-option" onClick={handleLogout}>
                  Logout
                </div>
              )}

            </div>
          )}
        </li>

        {/* JOIN US BUTTON (only when NOT logged in) */}
        {!user.isLoggedIn && (
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
