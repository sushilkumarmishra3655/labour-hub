import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

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
  const login = (data) => {
    const authUser = {
      isLoggedIn: true,
      id: data.user.id,
      name: data.user.name,
      role: data.user.role
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