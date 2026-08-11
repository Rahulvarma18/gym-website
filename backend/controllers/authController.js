import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import { validationResult } from 'express-validator';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/signup
// @desc    Register a new user
export const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { firstName, lastName, email, phone, password, confirmPassword } =
            req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Create user
        user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
        });

        // Remove password from response
        user.password = undefined;

        const token = generateToken(user._id, user.email, user.isAdmin);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message,
        });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        user.password = undefined;

        const token = generateToken(user._id, user.email, user.isAdmin);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};

// @route   POST /api/auth/google
// @desc    Google OAuth login/signup
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required',
            });
        }

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const email = payload.email;
        const firstName = payload.given_name || 'User';
        const lastName = payload.family_name || '';
        const profileImage = payload.picture || null;

        // Check if user exists
        let user = await User.findOne({
            $or: [{ email }, { googleId }],
        });

        if (!user) {
            // Create new user
            user = await User.create({
                firstName,
                lastName,
                email,
                googleId,
                googleEmail: email,
                profileImage,
                phone: '', // Will be filled later by user
                password: undefined, // Google users don't have passwords
            });
        } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.profileImage = profileImage || user.profileImage;
            await user.save();
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const authToken = generateToken(user._id, user.email, user.isAdmin);

        res.status(200).json({
            success: true,
            message: 'Google login successful',
            token: authToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Error with Google authentication',
            error: error.message,
        });
    }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            'registeredPlans.planId'
        );

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message,
        });
    }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, city, state, zipCode, dateOfBirth } =
            req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName,
                lastName,
                phone,
                address,
                city,
                state,
                zipCode,
                dateOfBirth,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message,
        });
    }
};

export default {
    signup,
    login,
    googleAuth,
    getCurrentUser,
    updateProfile,
};