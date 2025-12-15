const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    const googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '***' : 'MISSING',
        callbackURL: '/api/auth/google/callback'
    };
    console.log('Loading Google Strategy with config:', googleConfig);

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'http://localhost:5002/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log('Google Auth Strategy Invoked');
                console.log('Profile ID:', profile.id);
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }

                    const newUser = {
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        tpin: Math.floor(1000 + Math.random() * 9000).toString() // Generate random 4-digit TPIN
                    };

                    user = await User.create(newUser);
                    done(null, user);
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
