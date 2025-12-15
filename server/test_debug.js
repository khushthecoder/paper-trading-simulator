const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const testUserCreation = async () => {
    await connectDB();

    try {
        const email = `debug_${Date.now()}@test.com`;
        const username = `debug_${Date.now()}`;
        console.log('Attempting to create user:', { email, username });

        const user = await User.create({
            username,
            email,
            password: 'password123',
            tpin: '1234'
        });

        console.log('User created successfully:', user._id);

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is undefined in env');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        console.log('Token generated successfully:', token);

        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
};

testUserCreation();
