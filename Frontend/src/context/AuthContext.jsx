import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored
      ? JSON.parse(stored)
      : { isLoggedIn: false, role: null, id: null };
  });

  const login = (role) => {
    const existingUser = JSON.parse(localStorage.getItem("authUser"));

    const newUser = existingUser && existingUser.role === role
      ? existingUser
      : {
        id: role === "employer" ? "EMP1" : "WORK1", // stable ID
        isLoggedIn: true,
        role,
      };

    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser({ isLoggedIn: false, role: null, id: null });

    // 🔥 clear everything
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");  // old key cleanup
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;