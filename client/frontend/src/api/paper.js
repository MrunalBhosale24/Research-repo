// client/frontend/src/api/paper.js

import api from './config'; // CRITICAL: Import the configured API instance with JWT interceptor
import axios from 'axios'; // Standard axios for non-protected, full-URL requests like download

const PAPER_API_URL = '/papers'; // Use the relative path because the base URL is in config.js

/**
 * Uploads a paper using FormData. (PROTECTED)
 * @param {FormData} paperData - Contains form details and the PDF file.
 */
export const uploadPaper = (paperData) => {
    // Use 'api' to ensure the JWT token is attached to the header
    return api.post(`${PAPER_API_URL}/upload`, paperData, {
        headers: {
            // Must override Content-Type to multipart/form-data for file uploads
            'Content-Type': 'multipart/form-data', 
        },
    });
};

/**
 * Fetches papers. Filtered based on role and view type (Dashboard vs Search). (PROTECTED)
 * @param {string} search - Optional search query
 * @param {boolean} isDashboardView - True if fetching for the Dashboard (role-specific filter)
 */
export const fetchPapers = (search = '', isDashboardView = false) => {
    // Construct query parameters
    const params = new URLSearchParams();
    if (search) {
        params.append('search', search);
    }
    // CRITICAL: Send the flag if this is a Dashboard request
    if (isDashboardView) {
        params.append('dashboard', 'true');
    }
    
    // Build the URL with parameters
    const queryString = params.toString();
    const url = `${PAPER_API_URL}?${queryString}`;

    return api.get(url);
};

/**
 * Admin function to update the status of a paper. (PROTECTED - Admin Only)
 * @param {string} id - Paper ID
 * @param {string} status - 'approved' or 'rejected'
 */
export const updatePaperStatus = (id, status) => {
    // Use 'api' for Admin authorization check
    return api.put(`${PAPER_API_URL}/${id}/status`, { status });
};

/**
 * Downloads an approved paper. (PUBLIC/Non-Protected, uses full URL)
 * @param {string} id - Paper ID
 */
export const downloadPaper = (id) => {
    // Use standard axios and full URL for cleaner blob handling on this public route
    const FULL_DOWNLOAD_URL = `http://localhost:5000/api/papers/${id}/download`;
    return axios.get(FULL_DOWNLOAD_URL, { 
        responseType: 'blob' 
    });
};