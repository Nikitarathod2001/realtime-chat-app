import api from "./api";


// Register User
export const registerUser = async (userData) => {
  try {

    const response = await api.post("/auth/register", userData);
    return response.data;
    
  } catch (error) {
    console.log(error);
  }
};


// Login User
export const loginUser = async (userData) => {
  try {

    const response = await api.post("/auth/login", userData);
    return response.data;
    
  } catch (error) {
    console.log(error);
  }
};