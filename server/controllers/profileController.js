const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        user.email = email;
        await user.save();

        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.resetTpin = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // No password check needed as user is strictly authenticated via OTP/Google
        // and TPIN is a secondary trade PIN, not a login credential.

        const newTpin = Math.floor(1000 + Math.random() * 9000).toString();

        user.tpin = newTpin;
        user.tpinLastUpdated = Date.now();
        await user.save();

        res.status(200).json({
            message: 'TPIN reset successfully',
            tpin: newTpin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Internal method for checking TPIN (will be used by trade controller later)
exports.verifyTpin = async (req, res, next) => {
    // This is likely to be used as middleware or helper function
    // For now we just implement the reset/update logic in this controller
};
