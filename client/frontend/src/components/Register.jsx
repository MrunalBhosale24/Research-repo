import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { registerUser } from "../api/auth";
import collegeBackground from '../college_bg.jpg'; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ name, email, password, role });
      console.log("Registration success:", res.data);
      alert("Registered! You can now log in.");
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      alert("Error: " + (err.response?.data?.error || "Registration failed"));
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
          New User Registration
        </h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg bg-white focus:ring-teal-500 focus:border-teal-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {/* Admin option is removed */}
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <button
          type="submit"
          className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Register
        </button>
        
        {/* FIX: Login Link */}
        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account? 
          <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium ml-1">
            Login Here
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Register;