import React, { useState, useEffect, useCallback } from 'react'; 
import { fetchPapers, updatePaperStatus } from '../api/paper';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const navigate = useNavigate();
    
    // --- Helper function for fetching papers (wrapped in useCallback for dependency fix) ---
    const loadPapers = useCallback(async () => {
        setLoading(true);
        try {
            // Pass 'true' to indicate this is the Dashboard view. Backend applies role filter.
            const response = await fetchPapers('', true); 
            setPapers(response.data.data); 
            
        } catch (error) {
            console.error('Failed to fetch papers:', error.response || error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]); 
    
    // --- Admin Action Handler ---
    const handleStatusUpdate = async (paperId, status) => {
        setStatusMessage(`Updating status to ${status}...`);
        try {
            const response = await updatePaperStatus(paperId, status);
            setStatusMessage(response.data.message);
            
            // Remove the processed paper from the Admin review list
            setPapers(papers.filter(p => p._id !== paperId));
            setTimeout(() => setStatusMessage(''), 3000);
            
        } catch (error) {
            const errMsg = error.response?.data?.error || 'Failed to update status.';
            setStatusMessage(`Error: ${errMsg}`);
            console.error("Status update error:", error);
        }
    };

    useEffect(() => {
        if (user) {
            loadPapers();
        }
    }, [user, loadPapers]); 

    if (loading) {
        return <div className="p-8 text-center mt-10 text-xl text-teal-600">Loading Dashboard Data...</div>;
    }
    
    // --- ADMIN VIEW (Pending Paper Review) ---
    if (user.role === 'admin') {
        return (
             <div className="max-w-7xl mx-auto p-8 mt-10">
                <h2 
                    className="text-4xl font-extrabold mb-6 text-gray-800 border-b-4 border-teal-500 pb-2"
                >
                    Admin Review Queue
                </h2>
                
                {statusMessage && (
                    <div className={`p-4 mb-4 text-sm rounded-lg ${statusMessage.includes('Error') ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
                        {statusMessage}
                    </div>
                )}
                
                <p className="text-2xl font-semibold mt-6 mb-4 text-gray-700">Papers Awaiting Review ({papers.length})</p>
                
                {papers.length === 0 ? (
                    <div className="text-gray-500 mt-4 p-6 border-2 border-dashed rounded-lg bg-white shadow-sm text-center">
                        🎉 All caught up! No new papers require approval.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {papers.map(paper => (
                            <div key={paper._id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-xl hover:shadow-2xl transition duration-300">
                                <h4 className="text-2xl font-bold text-teal-700">{paper.title}</h4>
                                <p className="text-gray-600 mt-1">Authors: <span className="font-semibold">{paper.authors}</span></p>
                                <p className="text-gray-500 text-sm mt-1">Uploaded by: **{paper.uploadedBy?.name || 'Unknown'}** ({paper.uploadedBy?.role})</p>
                                <p className="text-gray-500 text-sm">Domain: {paper.domain} | Dept: {paper.department} | Year: {paper.year}</p>
                                
                                {/* Full Abstract for Review */}
                                <div className="mt-4 p-4 border-l-4 border-gray-400 bg-gray-50 rounded-r-md">
                                    <p className="font-bold text-lg text-gray-800 mb-1">Abstract:</p>
                                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                                        {paper.abstract || 'No abstract provided'}
                                    </p>
                                </div>

                                <div className="mt-6 flex space-x-4">
                                    <button
                                        onClick={() => handleStatusUpdate(paper._id, 'approved')}
                                        className="flex-1 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md"
                                    >
                                        ✅ Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(paper._id, 'rejected')}
                                        className="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md"
                                    >
                                        ❌ Reject
                                    </button>
                                    
                                    {/* VIEW BUTTON */}
                                    <a 
                                        href={`http://localhost:5000/api/papers/${paper._id}/download`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2 px-4 border border-teal-500 bg-teal-100 text-teal-700 font-medium rounded-lg hover:bg-teal-200 transition shadow-md"
                                    >
                                        👁️ View
                                    </a>
                                    {/* DOWNLOAD BUTTON */}
                                    <a 
                                        href={`http://localhost:5000/api/papers/${paper._id}/download`}
                                        download={paper.title} // Forces download
                                        className="py-2 px-4 border border-gray-400 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition shadow-md"
                                    >
                                        ⬇️ Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
         );
    }

    // --- STUDENT/FACULTY VIEW (Personal Submissions) ---
    return (
        <div className="p-8 mt-10 max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800">Welcome, {user.name}!</h2>
            <p className="text-gray-600 mt-2 text-lg border-b pb-4">Role: {user.role.toUpperCase()}</p>
            
            <p 
                className="mt-8 text-2xl font-semibold border-b-2 border-teal-300 pb-2 mb-4"
            >
                Your Submitted Papers ({papers.length})
            </p>
            
            {papers.length === 0 ? (
                <div className="text-gray-500 mt-4 p-6 border-2 border-dashed rounded-lg bg-white shadow-sm text-center">
                    You have not submitted any papers yet.
                </div>
            ) : (
                 <div className="space-y-4">
                    {papers.map(paper => {
                        let statusColor;
                        let statusBg;
                        switch (paper.status) {
                            case 'pending':
                                statusColor = 'text-yellow-800';
                                statusBg = 'bg-yellow-100';
                                break;
                            case 'approved':
                                statusColor = 'text-green-800';
                                statusBg = 'bg-green-100';
                                break;
                            case 'rejected':
                                statusColor = 'text-red-800';
                                statusBg = 'bg-red-100';
                                break;
                            default:
                                statusColor = 'text-gray-800';
                                statusBg = 'bg-gray-100';
                        }
                        return (
                            <div key={paper._id} className="p-5 border border-gray-100 rounded-xl bg-white shadow-lg flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{paper.title}</h4>
                                    <p className="text-gray-500 text-sm mt-1">Year: {paper.year} | Domain: {paper.domain}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Status Badge */}
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor} ${statusBg}`}>
                                        {paper.status ? paper.status.toUpperCase() : 'UNKNOWN'}
                                    </span>
                                    {/* Dual buttons conditional on approval */}
                                    {paper.status === 'approved' && (
                                        <>
                                            {/* VIEW BUTTON */}
                                            <a 
                                                href={`http://localhost:5000/api/papers/${paper._id}/download`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                                            >
                                                👁️ View
                                            </a>
                                            {/* DOWNLOAD BUTTON */}
                                            <a 
                                                href={`http://localhost:5000/api/papers/${paper._id}/download`}
                                                download={paper.title} // Forces download
                                                className="text-gray-600 hover:text-gray-800 font-medium text-sm border-l pl-4"
                                            >
                                                ⬇️ Download
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;