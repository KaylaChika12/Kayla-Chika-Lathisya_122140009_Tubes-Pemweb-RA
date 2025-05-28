
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; 

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:6543/register', form);
      console.log(response.data);
      alert('Registration Successful');
    } catch (error) {
      console.error(error);
      alert('Registration Failed');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="register-input"
          required
        />
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
