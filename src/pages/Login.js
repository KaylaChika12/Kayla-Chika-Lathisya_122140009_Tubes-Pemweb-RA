// File: pages\Login.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login as reduxLogin } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast"; // Import useToast
import "./Login.css";

// Login page component
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // Still keep local message for specific form validation
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const { displayToast } = useToast(); // Use the toast hook

  // Handles form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handles login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.email || !form.password) {
      setMessage("Email dan password wajib diisi!"); // Local message for direct form validation
      return;
    }

    const success = await login(form.email, form.password);

    if (success) {
      displayToast("Login berhasil!", "success"); // Use toast for success
      // navigate('/') is handled by useAuth hook
    } else {
      displayToast(
        error || "Login gagal. Periksa kembali email dan password.",
        "error"
      ); // Use toast for error
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Masukkan email Anda"
          value={form.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Masukkan password Anda"
          value={form.password}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}
      {/* Error message from useAuth is now handled by global toast */}
    </div>
  );
};

export default Login;
