const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided. ' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decode:", decoded);
        req.user = await User.findById(decoded.userId).select('-passwordHash');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next()
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only' });
    }
}