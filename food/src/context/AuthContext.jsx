import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setToken(storedToken);
    }
  }, []);

  const login = (userData, roleData, tokenData) => {
    // ✅ _id bhi save karo taaki socket comparison kaam kare
    const userToSave = {
      ...userData,
      _id: userData._id || userData.id,
      id: userData._id || userData.id,
    };
    setUser(userToSave);
    setRole(roleData);
    setToken(tokenData);

    localStorage.setItem("user", JSON.stringify(userToSave));
    localStorage.setItem("role", roleData);
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };