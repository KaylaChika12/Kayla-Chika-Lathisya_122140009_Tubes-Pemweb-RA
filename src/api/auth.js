import axios from 'axios';

const API_BASE = 'http://localhost:6543/api'; // URL backend kamu

export const loginUser = (username, password) =>
  axios.post(`${API_BASE}/login`, { username, password });

export const registerUser = (username, email, password) =>
  axios.post(`${API_BASE}/register`, { username, email, password });
