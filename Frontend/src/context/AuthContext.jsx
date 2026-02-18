import React, { createContext, useState } from "react";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored
      ? JSON.parse(stored)
      : { isLoggedIn: false, role: null };
  });

  const login = (role) => {
    const newUser = { isLoggedIn: true, role };
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser({ isLoggedIn: false, role: null });
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


