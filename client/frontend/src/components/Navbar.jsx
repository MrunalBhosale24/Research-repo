// client/frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout(null); // Clear user state in App.jsx
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/dashboard">Research Portal</Link>
        </div>
        
        {user ? (
    <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="text-gray-300 hover:text-white transition duration-150">
            Dashboard
        </Link>
        
        {/* The condition ensures only Studen/Faculty see 'Upload Paper' in the Navbar if needed, 
           but we've already added a big button on the dashboard, so let's simplify: */}
        
        <Link to="/upload" className="text-gray-300 hover:text-white transition duration-150">
            Upload
        </Link>
        
        <Link to="/search" className="text-gray-300 hover:text-white transition duration-150">
            View Campus Papers
        </Link>
        
        <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm transition duration-150"
        >
            Logout ({user.name})
        </button>
    </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition duration-150">Login</Link>
            <Link to="/register" className="text-gray-300 hover:text-white transition duration-150">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;