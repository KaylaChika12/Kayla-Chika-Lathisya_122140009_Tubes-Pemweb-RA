import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      alert('Username dan password wajib diisi!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:6543/api/login', {
        username: form.username,
        password: form.password
      });

      dispatch(login({ username: form.username }));
      alert(res.data.message || 'Login berhasil!');
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login gagal. Periksa kembali username dan password.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Masukkan username Anda"
          value={form.username}
          onChange={handleChange}
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Masukkan password Anda"
          value={form.password}
          onChange={handleChange}
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
