import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom"; 
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import UploadPaper from "./components/UploadPaper";
import SearchPapers from "./components/SearchPapers";

// --- Navbar Component: Handles all navigation links ---
const Navbar = ({ user, handleLogout }) => {
  
  const location = useLocation(); 

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Function to build link classes (THE ACTIVE BOX HIGHLIGHT)
  const getLinkClasses = (path) => {
    // Base classes for inactive link (padding and transition)
    let classes = "p-2 rounded-md transition duration-150";

    if (isActive(path)) {
      // Active link: Teal background, white text, bold font
      classes += " bg-teal-700 text-white font-bold"; 
    } else {
      // Inactive link: Gray text, dark hover background, teal hover text
      classes += " text-gray-300 hover:bg-gray-700 hover:text-teal-300";
    }
    
    return classes;
  };

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/dashboard" 
          className="text-2xl font-bold text-teal-300 hover:text-teal-100 transition duration-150"
        >
          Research Repo ({user.role.toUpperCase()})
        </Link>
        <div className="flex items-center space-x-2"> 
          
          {user.role === 'admin' ? (
            <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
              Review Queue
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                My Submissions
              </Link>
              <Link to="/upload" className={getLinkClasses('/upload')}>
                Upload Paper
              </Link>
            </>
          )}
          
          <Link to="/search" className={getLinkClasses('/search')}>
            View All Papers
          </Link>

          <span className="text-sm text-gray-400 ml-6"></span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 rounded text-white text-sm hover:bg-red-700 transition ml-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
// -----------------------

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} handleLogout={handleLogout} /> 
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        {user.role !== 'admin' && <Route path="/upload" element={<UploadPaper />} />}
        <Route path="/search" element={<SearchPapers />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;