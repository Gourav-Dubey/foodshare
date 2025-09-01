import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [role, setRole] = useState(null);

  const login = (userData, roleData) => {
    setUser(userData);
    setRole(roleData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", roleData);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for using context
export const useAuth = () => useContext(AuthContext);

// ✅ Default export (if you want to import AuthContext directly)
export { AuthContext };
