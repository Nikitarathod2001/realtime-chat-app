import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService";


export const authContext = createContext();

export const AuthContextProvider = ({children}) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("chat-token") || null
  );

  // Store user details
  const storeUserDetails = (userData, jwtToken) => {
    localStorage.setItem("chat-token", jwtToken);

    setUser(userData);
    setToken(jwtToken);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("chat-token");

    setUser(null);
    setToken(null);
  };

  // Get user details from backend to persist user information on frontend
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {

        if(!token) {
          setLoading(false);
          return;
        }

        const data = await getProfile();
        setUser(data.user);
        
      } catch (error) {
        localStorage.removeItem("chat-token");

        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


  const value = {
    user, token, storeUserDetails, logout, loading
  };

  return <authContext.Provider value={value}>
    {children}
  </authContext.Provider>

};

export const useAuth = () => {
  return useContext(authContext);
};