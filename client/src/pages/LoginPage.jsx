import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const {storeUserDetails} = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const data = await loginUser(formData);

      storeUserDetails(data.user, data.token);
      toast.success(data.message);

      setFormData({
        email: "",
        password: ""
      });

      navigate("/chat");
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>

      <div className='w-full max-w-md bg-white shadow-lg rounded-xl p-8'>

        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Login
        </h2>

        <form onSubmit={handleSubmit}
          className='space-y-4'
        >

          <input type="email" 
            name='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none'
          />

          <input type="password" 
            name='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none'
          />

          <button type="submit"
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition duration-200'
          >
            Login
          </button>

        </form>

        <p className='text-center text-gray-600 mt-5'>

          Don't have an account?{" "}

          <span onClick={() => navigate("/")}
            className='block sm:inline text-blue-500 font-medium cursor-pointer hover:text-blue-600'  
          >
            Create account here
          </span>

        </p>

      </div>

    </div>
  )
}

export default LoginPage
