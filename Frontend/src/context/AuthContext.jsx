import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  // 🔥 IMPORTANT CHANGE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore user on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (storedUser) {
      setUser({
        isLoggedIn: true,
        id: storedUser.id,
        name: storedUser.name,
        role: storedUser.role
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
  const login = (userData) => {
    const authUser = {
      isLoggedIn: true,
      id: userData.id,
      name: userData.name,
      role: userData.role
    };

    setUser(authUser);

    localStorage.setItem("loggedUser", JSON.stringify(userData));
  };

  // 🚪 Logout
  const logout = () => {
    setUser({
      isLoggedIn: false,
      id: null,
      name: "",
      role: null
    });

    localStorage.removeItem("loggedUser");
  };

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