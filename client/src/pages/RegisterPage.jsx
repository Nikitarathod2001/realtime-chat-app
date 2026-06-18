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
    <div>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>

        <input type="text" 
          name='username'
          placeholder='Enter your name'
          value={formData.username}
          onChange={handleChange}
          required
        />

        <br />
        <br />

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

        <button type="submit">
          Create Account
        </button>

        <br />
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>

      </form>
    </div>
  )
}

export default RegisterPage
