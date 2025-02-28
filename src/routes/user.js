const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');
const { errorResponse, successResponse } = require('../helper/helper');

router.get('/:userId', async (req, res) => {
    const {userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return errorResponse(res, 400, 'Invalid user ID format');
    }

    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        successResponse(res, '', user);
    } catch (error) {
        errorResponse(res, 500, 'Internal server error');
    }
});

module.exports = router