import axios from "axios";

const API_BASE = "http://localhost:6543/api";

// Function to handle user login
export const loginUser = (username, password) =>
  axios.post(`${API_BASE}/login`, { username, password });

// Function to handle user registration
export const registerUser = (username, email, password) =>
  axios.post(`${API_BASE}/register`, { username, email, password });
