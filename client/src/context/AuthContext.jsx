import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("chat_token");
    const storedUser = localStorage.getItem("chat_user");

    if(storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Register User
  const registerUser = async (formData) => {
    try {

      await api.post("/auth/register", formData);

      toast.success("Registration Successful!");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
      throw error;
    }
  };

  // Login User
  const loginUser = async (formData) => {
    try {

      const response = await api.post("/auth/login", formData);

      const {token, user} = response.data;

      localStorage.setItem("chat_token", token);
      localStorage.setItem("chat_user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      toast.success("Login successful!");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  // Logout Functionality
  const logout = () => {
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");

    setToken(null);
    setUser(null);

    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{
      user, setUser, token, loading,
      registerUser, loginUser, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);