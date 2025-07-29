/* eslint-disable no-unused-vars */
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // <-- TAMBAHKAN STATE LOADING

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      try {
        const decodedUser = jwtDecode(tokenFromStorage);
        if (decodedUser.exp * 1000 < Date.now()) {
          // Token kadaluarsa
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        } else {
          // Token valid
          setUser(decodedUser);
          setToken(tokenFromStorage);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${tokenFromStorage}`;
        }
      } catch (error) {
        // Token tidak valid
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }
    // Apapun hasilnya, proses pengecekan selesai
    setLoading(false); // <-- SET LOADING JADI FALSE DI AKHIR
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {" "}
      {/* <-- EKSPOR LOADING */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
