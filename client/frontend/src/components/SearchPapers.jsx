import React, { useState, useEffect } from 'react';
import { fetchPapers } from '../api/paper'; 

const SearchPapers = () => {
    const [papers, setPapers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [allApprovedPapers, setAllApprovedPapers] = useState([]); 

    const loadPapers = async () => {
        setLoading(true);
        try {
            const response = await fetchPapers(''); 
            
            const approvedPapers = response.data.data.filter(p => p.status === 'approved');
            
            setAllApprovedPapers(approvedPapers);
            setPapers(approvedPapers); 
        } catch (error) {
            console.error('Failed to fetch papers:', error.response || error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadPapers();
    }, []);

    // Client-side filtering logic
    useEffect(() => {
        const filtered = allApprovedPapers.filter(paper => 
            paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPapers(filtered);
    }, [searchTerm, allApprovedPapers]);
    
    // Paper card component for displaying results
    const PaperCard = ({ paper }) => (
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition duration-300">
            <h4 className="text-xl font-bold text-teal-700">{paper.title}</h4>
            <p className="text-gray-600 mt-1">Authors: <span className="font-semibold">{paper.authors}</span></p>
            <p className="text-gray-500 text-sm">Domain: {paper.domain} | Year: {paper.year}</p>
            
            {/* Display full abstract below details */}
            <div className="mt-3 text-sm text-gray-700">
                <p className="font-semibold">Abstract:</p>
                <p className="mt-1">{paper.abstract}</p>
            </div>
            
            <div className="mt-4 flex space-x-3 justify-end">
                 {/* VIEW BUTTON */}
                <a 
                    href={`http://localhost:5000/api/papers/${paper._id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-teal-100 text-teal-700 border border-teal-300 rounded hover:bg-teal-200 transition"
                >
                    👁️ View Paper
                </a>
                {/* DOWNLOAD BUTTON */}
                <a 
                    href={`http://localhost:5000/api/papers/${paper._id}/download`}
                    download={paper.title}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 border border-gray-300 rounded hover:bg-gray-300 transition"
                >
                    ⬇️ Download
                </a>
            </div>
        </div>
    );


    return (
        <div className="max-w-4xl mx-auto p-8 mt-10"> {/* Adjusted max-width for better vertical alignment */}
            <h2 
                className="text-4xl font-extrabold mb-6 text-gray-800 border-b-4 border-teal-500 pb-2"
            >
                View All Approved Papers
            </h2>
            
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search by Title, Author, or Domain..."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-teal-500 focus:border-teal-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {loading ? (
                <div className="text-center mt-10 text-xl text-teal-600">Loading Papers...</div>
            ) : papers.length === 0 ? (
                <div className="text-gray-500 mt-4 p-6 border-2 border-dashed rounded-lg bg-white shadow-sm text-center">
                    No approved papers found matching your search term.
                </div>
            ) : (
                <p className="text-lg text-gray-700 mb-4">Showing **{papers.length}** result(s).</p>
            )}
            
            <div className="grid grid-cols-1 gap-6"> {/* 🛑 Simplified to a single column grid */}
                {papers.map(paper => (
                    <PaperCard key={paper._id} paper={paper} />
                ))}
            </div>
        </div>
    );
};

export default SearchPapers;