const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Send OTP for Login/Signup
// @route   POST /api/auth/send-otp
// @access  Public
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    console.log('Register request body:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a random TPIN for the user initially
        const tpin = Math.floor(1000 + Math.random() * 9000).toString();

        console.log('Creating user...');
        const user = await User.create({
            username,
            email,
            password, // Will be hashed by pre-save
            tpin // Will be hashed by pre-save
        });

        if (user) {
            console.log('User created:', user._id);
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                balance: user.balance,
                token: generateToken(user._id),
            });
        } else {
            console.log('Invalid user data (user creation returned nullish)');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email);


    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                balance: user.balance,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMe = async (req, res) => {
    res.set('Cache-Control', 'no-store');
    // Removed password/otp from select, just getting defaults
    const user = await User.findById(req.user._id);
    res.status(200).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        // No checks for password existence anymore
    });
};
