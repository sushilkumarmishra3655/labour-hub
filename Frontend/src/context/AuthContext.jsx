import React, { createContext, useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const timeoutRef = useRef(null);
  const AUTO_LOGOUT_TIME = 20 * 60 * 1000; // 20 minutes in milliseconds

  // 🔥 IMPORTANT CHANGE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore user on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser({
        isLoggedIn: true,
        ...storedUser
      });
    } else {
      setUser({
        isLoggedIn: false,
        id: null,
        name: "",
        role: null
      });
    }

    setLoading(false); // 🔥 VERY IMPORTANT
  }, []);

  // 🔑 Login
  const login = (data) => {
    const authUser = {
      isLoggedIn: true,
      ...data.user
    };

    setUser(authUser);

    localStorage.setItem("token", data.token);
    localStorage.setItem("loggedUser", JSON.stringify(data.user));
  };

  // 🚪 Logout
  const logout = () => {
    setUser({
      isLoggedIn: false,
      id: null,
      name: "",
      role: null
    });

    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
  };

  // 🔑 Auto Logout Logic due to inactivity
  useEffect(() => {
    // Only run if the user is logged in
    if (!user || user.isLoggedIn !== true) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const handleInactivityLogout = () => {
      logout();
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'You have been automatically logged out after 20 minutes of inactivity.',
        confirmButtonColor: '#3085d6',
        timer: 8000,
        timerProgressBar: true
      });
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleInactivityLogout, AUTO_LOGOUT_TIME);
    };

    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
    ];

    // Attach event listeners to reset timer on user activity
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Initialize timer

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading // 🔥 ADD THIS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;