// server/routes/papers.js

const express = require('express');
const { 
    uploadPaper, 
    getPapers, 
    updatePaperStatus, 
    downloadPaper 
} = require('../controllers/paperController'); 

// 🛑 CRITICAL FIX: Ensure 'protect' and 'restrictTo' are imported using destructuring {}
const { protect, restrictTo } = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 

const router = express.Router();

// 1. UPLOAD PAPER 
router.post(
    '/upload', 
    protect, 
    restrictTo('student', 'faculty'), 
    upload.single('file'), 
    uploadPaper
);

// 2. GET PAPERS 
router.get('/', protect, getPapers); 

// 3. ADMIN: UPDATE STATUS 
router.put(
    '/:id/status',
    protect, 
    restrictTo('admin'), 
    updatePaperStatus
);

// 4. PUBLIC: DOWNLOAD PAPER 
router.get('/:id/download', downloadPaper);


module.exports = router;