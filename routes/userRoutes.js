const express = require('express');
const router = express.Router();
const { User, Lodge } = require('../models');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password').populate('lodge', 'name');
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, lodgeId } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const user = await User.create({
            name,
            email,
            password, // In production, hash this!
            role: role || 'admin',
            lodgeId: lodgeId || null
        });

        const userObj = user.toObject(); // or .toJSON()
        delete userObj.password;

        res.status(201).json({ success: true, user: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Check if email already exists for another user
        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.params.userId }
            });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { name, email, phone },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update user (full update for admin management)
router.put('/:userId', async (req, res) => {
    try {
        const { name, email, password, role, lodgeId } = req.body;

        // Check if email already exists for another user
        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.params.userId }
            });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        const updateData = { name, email, role, lodgeId };

        // Only update password if provided
        if (password) {
            updateData.password = password; // In production, hash this!
        }

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update password
router.put('/password/:userId', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Need password here, so findById defaults to returning selected fields if not excluded in schema, 
        // but it's safe to just fetch it and compare.
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password (in production, compare hashed passwords)
        if (user.password !== currentPassword) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update password (in production, hash the password)
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete user
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
