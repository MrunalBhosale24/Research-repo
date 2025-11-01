// server/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware to check for JWT token and attach user to req
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ error: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};


// Middleware to restrict access based on user role
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user is set by the protect middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `User role ${req.user.role || 'unknown'} is not authorized to perform this action` 
            });
        }
        next();
    };
};