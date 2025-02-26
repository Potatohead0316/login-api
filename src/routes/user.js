const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');

router.get('/:userId', async (req, res) => {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format', success: false });
    }

    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

module.exports = router