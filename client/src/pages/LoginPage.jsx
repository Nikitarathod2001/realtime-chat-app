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
    <div>
      <h2>Login Page</h2>

      <form onSubmit={handleSubmit}>

        <input type="email" 
          name='email'
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input type="password" 
          name='password'
          placeholder='Enter your password'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type='submit'>
          Login
        </button>

        <br />
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/")}>
            Create account here
          </span>
        </p>

      </form>
    </div>
  )
}

export default LoginPage
