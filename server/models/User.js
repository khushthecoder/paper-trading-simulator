const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    otp: {
        type: String,
        select: false,
    },
    otpExpires: {
        type: Date,
        select: false,
    },
    balance: {
        type: Number,
        default: 100000,
    },
    tpin: {
        type: String, // Storing hashed TPIN
        select: false // Do not return by default
    },
    tpinLastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    // Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // Hash TPIN if modified
    if (this.isModified('tpin')) {
        // Only hash if it's not already hashed (basic check for length, though better logic exists)
        // Assuming raw TPIN is 4 digits. Bcrypt hash is much longer.
        if (this.tpin && this.tpin.length <= 6) {
            const salt = await bcrypt.genSalt(10);
            this.tpin = await bcrypt.hash(this.tpin, salt);
        }
    }
});


// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to verify TPIN
userSchema.methods.matchTpin = async function (enteredTpin) {
    if (!this.tpin) return false;
    return await bcrypt.compare(enteredTpin, this.tpin);
};

module.exports = mongoose.model('User', userSchema);

