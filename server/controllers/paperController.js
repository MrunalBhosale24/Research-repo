const Paper = require('../models/Paper');
const path = require('path');
const fs = require('fs');

// --- 1. UPLOAD PAPER (No Change) ---
exports.uploadPaper = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const paper = await Paper.create({
            title: req.body.title,
            authors: req.body.authors,
            abstract: req.body.abstract,
            domain: req.body.domain,
            department: req.body.department,
            year: req.body.year, 
            file: req.file.filename, 
            uploadedBy: req.user.id,
        });

        res.status(201).json({ 
            success: true, 
            message: 'Paper submitted successfully and is awaiting admin approval.',
            data: paper 
        });
    } catch (error) {
        console.error('Paper upload error:', error); 
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        res.status(500).json({ error: 'Error occurred during upload.' });
    }
};

// --- 2. GET PAPERS (CRITICAL UPDATE) ---
// server/controllers/paperController.js

// ... (existing code for getPapers function) ...

exports.getPapers = async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const search = req.query.search;
    const isDashboardView = req.query.dashboard === 'true'; 

    let filter = {};

    // 🛑 CRITICAL DEBUGGING LINES TO ADD
    console.log(`[DEBUG] User Role: ${req.user.role}, Is Admin: ${isAdmin}, Is Dashboard: ${isDashboardView}`);
    
    if (isAdmin && isDashboardView) {
        // ADMIN DASHBOARD: See only PENDING papers for review
        filter = { status: 'pending' };
        console.log(`[DEBUG] Applying Admin Filter: ${JSON.stringify(filter)}`); // Log admin filter
    } else if (isDashboardView) {
        // STUDENT/FACULTY DASHBOARD: See ALL of their own papers
        filter = { uploadedBy: req.user.id };
        console.log(`[DEBUG] Applying User Filter (ID: ${req.user.id}): ${JSON.stringify(filter)}`); // Log user filter
    } else {
        // SEARCH VIEW (Default): See only APPROVED papers
        filter = { status: 'approved' };
        console.log(`[DEBUG] Applying Search Filter: ${JSON.stringify(filter)}`); // Log public filter
    }
    
    // ... (rest of the search logic and try/catch block remains the same) ...
    // Add search logic if a query exists
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        const searchFilter = {
            $or: [
                { title: searchRegex },
                { authors: searchRegex },
                { domain: searchRegex },
                { department: searchRegex },
                { abstract: searchRegex },
            ]
        };
        
        // Combine the base filter with the search filter
        filter = { $and: [filter, searchFilter] };
    }

    try {
        const papers = await Paper.find(filter)
            .populate('uploadedBy', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: papers.length, data: papers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch papers.' });
    }
};

// --- 3. UPDATE STATUS (No Change) ---
exports.updatePaperStatus = async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);

        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }
        
        if (req.body.status !== 'approved' && req.body.status !== 'rejected') {
             return res.status(400).json({ error: 'Invalid status value.' });
        }

        paper.status = req.body.status;
        await paper.save();

        res.status(200).json({ success: true, message: `Paper status updated to ${paper.status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update paper status.' });
    }
};

// --- 4. DOWNLOAD PAPER (No Change) ---
exports.downloadPaper = async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);

        if (!paper || paper.status !== 'approved') {
            return res.status(404).json({ error: 'File not found or not yet approved.' });
        }

        const filePath = path.join(__dirname, '../uploads', paper.file);

        if (fs.existsSync(filePath)) {
            res.download(filePath, paper.file, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    res.status(500).json({ error: 'Could not download the file.' });
                }
            });
        } else {
            res.status(404).json({ error: 'File not found on server disk.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during download request.' });
    }
};