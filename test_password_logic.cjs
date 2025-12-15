const mongoose = require('mongoose');
const User = require('./server/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Create a dummy google user without password
        const email = 'testgoogle_' + Date.now() + '@example.com';
        const user = await User.create({
            username: 'TestGoogle' + Date.now(),
            email: email,
            googleId: '123456789'
        });
        console.log('Created user:', user._id);

        // 2. Fetch verifying no password
        const u1 = await User.findById(user._id).select('+password');
        console.log('U1 Password:', u1.password); // Should be undefined

        // 3. Set Password
        u1.password = 'newpassword123';
        await u1.save();
        console.log('Password saved');

        // 4. Fetch again verifying password
        const u2 = await User.findById(user._id).select('+password');
        console.log('U2 Password:', u2.password); // Should be hash
        console.log('Has Password:', !!u2.password);

        await User.deleteOne({ _id: user._id });
        console.log('Cleaned up');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
