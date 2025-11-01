// client/frontend/src/components/UploadPaper.jsx

import React, { useState } from "react";
import { uploadPaper } from "../api/paper"; 
import { useNavigate } from "react-router-dom";

const UploadPaper = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    abstract: "",
    // 🛑 NEW FIELDS ADDED HERE
    domain: "",
    department: "",
    publicationYear: "" // We will map this to 'year' on submission
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!file) {
      setError("Please select a research paper (PDF).");
      return;
    }
    
    setLoading(true);

    const data = new FormData();
    data.append('file', file); 
    
    // Append all text fields
    data.append('title', formData.title);
    data.append('authors', formData.authors);
    data.append('abstract', formData.abstract);
    
    // 🛑 CRITICAL: Mapping frontend name 'publicationYear' to backend name 'year'
    data.append('year', formData.publicationYear); 
    
    // 🛑 NEW FIELDS
    data.append('domain', formData.domain);
    data.append('department', formData.department);

    try {
      const response = await uploadPaper(data);
      setMessage(response.data.message);
      
      // Clear form after successful submission
      setFormData({ 
          title: "", 
          authors: "", 
          abstract: "", 
          domain: "", 
          department: "", 
          publicationYear: "" 
      });
      setFile(null);
      
      setTimeout(() => navigate('/dashboard'), 3000); 

    } catch (err) {
      const errMsg = err.response?.data?.error || "An unexpected error occurred during upload.";
      setError(errMsg);
      console.error("Upload failed:", err.response?.data || err);
    } finally {
        setLoading(false);
    }
  };

  // ... (Tailwind CSS/Return Block for Form) ...
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        Submit Research Paper
      </h2>

      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Paper Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Authors */}
        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700">Authors (Comma separated)</label>
          <input
            type="text"
            name="authors"
            id="authors"
            required
            value={formData.authors}
            onChange={handleChange}
            placeholder="e.g., John Doe, Jane Smith"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* 🛑 NEW INPUT: Domain */}
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Research Domain/Area</label>
          <input
            type="text"
            name="domain"
            id="domain"
            required
            value={formData.domain}
            onChange={handleChange}
            placeholder="e.g., Artificial Intelligence, Renewable Energy"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 🛑 NEW INPUT: Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            id="department"
            required
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Computer Science, Mechanical Engineering"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Publication Year (Maps to 'year' in the schema) */}
        <div>
          <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">Publication Year</label>
          <input
            type="number"
            name="publicationYear" // Name used in state
            id="publicationYear"
            required
            min="1900"
            max={new Date().getFullYear()}
            value={formData.publicationYear}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Abstract */}
        <div>
          <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">Abstract</label>
          <textarea
            name="abstract"
            id="abstract"
            rows="4"
            required
            value={formData.abstract}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* File Input */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Research Paper (PDF only, Max 10MB)</label>
          <input
            type="file"
            name="file"
            id="file"
            required
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            {loading ? 'Submitting...' : 'Submit Paper for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPaper;