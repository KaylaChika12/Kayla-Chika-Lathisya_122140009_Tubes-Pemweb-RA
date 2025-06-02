// File: pages\Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast"; // Import useToast
import "./Register.css";

// Register page component
const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(""); // Still keep local message for specific form validation
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const { displayToast } = useToast(); // Use the toast hook

  // Handles form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handles registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.username || !form.email || !form.password) {
      setMessage("Semua kolom wajib diisi!"); // Local message for direct form validation
      return;
    }

    const success = await register(form.username, form.email, form.password);

    if (success) {
      displayToast("Registrasi berhasil! Silakan login.", "success"); // Use toast for success
      navigate("/login");
    } else {
      displayToast(error || "Registrasi gagal. Coba lagi.", "error"); // Use toast for error
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
        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      {message && <p className="register-message">{message}</p>}
      {/* Error message from useAuth is now handled by global toast */}
    </div>
  );
};

export default Register;
