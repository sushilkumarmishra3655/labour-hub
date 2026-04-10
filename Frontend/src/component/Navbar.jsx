import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";
import { AuthContext } from "../context/AuthContext";
import { Menu, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import CustomLanguageSwitcher from "./CustomLanguageSwitcher";

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="navbar notranslate">

      <div className="logos">
        <Logo />
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={28} />
      </button>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* NOT LOGGED IN */}
        {!user?.isLoggedIn && (
          <>
            <li><Link to="/FindWork">Find Work</Link></li>
            <li><Link to="/PostJob">Post Job</Link></li>
          </>
        )}

        {/* WORKER */}
        {user?.isLoggedIn && user.role === "worker" && (
          <>
            {/* <li><Link to="/worker-dashboard">Dashboard</Link></li> */}
            <li><Link to="/FindWork">Find Work</Link></li>
          </>
        )}

        {/* EMPLOYER */}
        {user?.isLoggedIn && user.role === "employer" && (
          <>
            {/* <li><Link to="/employer-dashboard">Dashboard</Link></li> */}
            <li><Link to="/PostJob">Post Job</Link></li>
          </>
        )}

        {/* ADMIN */}
        {user?.isLoggedIn && user.role === "admin" && (
          <>
            {/* <li><Link to="/admin-dashboard">Admin Panel</Link></li>
            <li><Link to="/users">Users</Link></li> */}
          </>
        )}

        <li><Link to="/contact">Contact</Link></li>


        {/* PROFILE / LOGIN */}
        {user?.isLoggedIn ? (
          <>
          <li className="profile-menu" ref={dropdownRef}>

            <button
              className="profile-btn"
              onClick={() => setOpen(!open)}
            >

              <div className="profile-avatar-letter" style={user?.profileImage ? { padding: 0, overflow: 'hidden' } : {}}>
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>

              <span className="profile-name">
                {user.name}
              </span>

              <span className={`caret ${open ? "open" : ""}`}>
                <ChevronDown size={18} />
              </span>

            </button>

            {open && (

              <div className="profile-dropdown">

                <div className="profile-dropdown-item" onClick={() => { navigate(`/${user.role}-dashboard/profile`); setOpen(false); }}>
                  <User size={18} />
                  <span>Profile</span>
                </div>

                <div className="profile-dropdown-item" onClick={goDashboard}>
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>


                <div className="dropdown-divider"></div>

                <div
                  className="profile-dropdown-item logout-option"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>

              </div>

            )}

          </li>
          <li className="lang-item no-bg">
            <CustomLanguageSwitcher variant="navbar" />
          </li>
          </>

        ) : (
          <>
            <li className="lang-item no-bg">
              <CustomLanguageSwitcher variant="navbar" />
            </li>
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
          </>

        )}


      </ul>
    </nav>
  );
};

export default Navbar;