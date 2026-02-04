import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      // Optional: Check token expiration
      try {
        const decoded = jwtDecode(user.accessToken);
        if (decoded.exp * 1000 < Date.now()) {
          AuthService.logout();
          setCurrentUser(undefined);
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        AuthService.logout();
        setCurrentUser(undefined);
      }
    }
    setLoading(false);
  }, []);

  const login = async (nip, password) => {
    const user = await AuthService.login(nip, password);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
