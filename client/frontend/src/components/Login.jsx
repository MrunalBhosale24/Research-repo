import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { loginUser } from "../api/auth";
import collegeBackground from '../college_bg.jpg'; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      console.log("Login success:", res.data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      console.error("Login error:", err.response?.data);
      alert("Error: " + (err.response?.data?.error || "Login failed"));
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${collegeBackground})` }} 
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-sm backdrop-blur-sm bg-opacity-90"
      >
        <h2 
          className="text-3xl font-extrabold mb-6 text-center text-teal-700"
        >
          Research Repository Login
        </h2>
        <input
          type="email"
          placeholder="College Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Login
        </button>
        
        {/* FIX: Register Link */}
        <p className="text-center mt-4 text-gray-600 text-sm">
          Don't have an account? 
          <Link to="/register" className="text-teal-600 hover:text-teal-800 font-medium ml-1">
            Register Here
          </Link>
        </p>
        
      </form>
    </div>
  );
};

export default Login;