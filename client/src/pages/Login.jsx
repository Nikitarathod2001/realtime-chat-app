import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {

  const navigate = useNavigate();
  const {loginUser} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.email || !formData.password) {
      return;
    }

    try {

      setLoading(true);

      await loginUser(formData);

      navigate("/chat");
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200 px-4'>

      <form onSubmit={handleSubmit}
        className='w-full max-w-md bg-white px-10 py-12 rounded-xl shadow-md'
      >

        <h1 className='text-3xl font-bold text-black/70 text-center mb-6'>
          Login
        </h1>

        <input type="email" 
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-full border border-zinc-400 rounded-lg px-4 py-2 mb-4 outline-none'
        />

        <input type="password" 
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='w-full border border-zinc-400 rounded-lg px-4 py-2 mb-4 outline-none'
        />

        <button type='submit'
          disabled={loading}
          className='w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-4xl cursor-pointer transition-all duration-300 font-medium'
        >
          {
            loading ? "Logging in..." : "Login"
          }
        </button>

        <p className='text-center mt-4'>
          Don't have an account?{" "}

          <Link to="/"
            className='text-teal-600 hover:underline'
          >
            Register
          </Link>
        </p>

      </form>
      
    </div>
  )
}

export default Login
