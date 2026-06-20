import React, { useState } from 'react'
import { registerUser } from '../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

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

      const data = await registerUser(formData);

      toast.success("Registered Successfully!");

      setFormData({
        username: "",
        email: "",
        password: ""
      });
      navigate("/login");

      
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>

      <div className='w-full max-w-md bg-white shadow-lg rounded-xl p-8'>

        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Create Account
        </h2>

        <form onSubmit={handleSubmit}
          className='space-y-4'
        >

          <input type="text" 
            name='username'
            placeholder='Enter your name'
            value={formData.username}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none'
          />

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
            Create Account
          </button>

        </form>

        <p className='text-center text-gray-600 mt-5'>

          Already have an account?{" "}

          <span onClick={() => navigate("/login")}
            className='block sm:inline text-blue-500 font-medium cursor-pointer hover:text-blue-600'  
          >
            Login here
          </span>

        </p>

      </div>

    </div>
  )
}

export default RegisterPage
