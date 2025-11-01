// client/frontend/src/api/auth.js

import axios from 'axios';

// Create a specific Axios instance for authentication.
// We use the base URL for the 'auth' routes here.
// NOTE: This instance does NOT have the JWT interceptor, which is correct, 
// because you cannot send a token before you've logged in.
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Ensure this matches your server URL
});

// Register
export const registerUser = (userData) => API.post("/register", userData);

// Login
export const loginUser = (credentials) => API.post("/login", credentials);