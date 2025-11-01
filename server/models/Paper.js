// server/models/Paper.js

const mongoose = require('mongoose');

const paperSchema = mongoose.Schema({
    title: { type: String, required: true },
    authors: { type: String, required: true },
    abstract: { type: String, required: true },
    domain: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    file: { type: String, required: true }, 
    
    // 🛑 CRITICAL FIX: Ensure this field is present, uses 'status', and has 'pending' as default
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' // When a paper is created, it is 'pending' by default
    },
    
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Paper', paperSchema);