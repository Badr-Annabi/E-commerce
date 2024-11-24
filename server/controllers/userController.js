const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Register a new User
exports.registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({error: 'User already exists'});

        // Create new User
        const user = new User({name, email, passwordHash: password});
        await user.save();

        res.status(201).json({message: 'User created successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// Login User
exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({error: 'User does not exist'});

        //Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({error: 'User does not exist'});


        //Generate Token
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(201).json({token, message: 'Login successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};