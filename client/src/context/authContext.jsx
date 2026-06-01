import { createContext, useContext, useState } from "react";


export const authContext = createContext();

export const AuthContextProvider = ({children}) => {

  const [user, setUser] = useState(null);
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

  const value = {
    user, token, storeUserDetails, logout
  };

  return <authContext.Provider value={value}>
    {children}
  </authContext.Provider>

};

export const useAuth = () => {
  return useContext(authContext);
};