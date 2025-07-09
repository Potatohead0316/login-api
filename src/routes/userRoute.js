const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { errorResponse, successResponse } = require('../helper/helper');
const verifyToken = require('../middleware/authMiddleWare');
const mongoose = require('mongoose');

router.get('/secret', verifyToken, (req, res) => { // trigger this test api to determine whether the token expires within the given time/duration
    return res.json({
        message: `You have accessed a protected route as ${req.user.role}`,
        userId: req.user.id,
        issuedAt: new Date(req.user.iat * 1000).toLocaleTimeString(),
        expiresAt: new Date(req.user.exp * 1000).toLocaleTimeString()
    });
});

router.get('/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return errorResponse(res, 400, 'Invalid user ID format');
    }

    try {
        const user = await User.findById(userId).select('-password -__v');

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        successResponse(res, '', user);
    } catch (error) {
        errorResponse(res, 500, 'Internal server error');
    }
});

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (existingUser) {
            return errorResponse(res, 400, 'Username already exists');
        }
        const newUser = new User({
            username,
            password: username,
            role
        });
        await newUser.save();
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        successResponse(res, 'User registered successfully!', userWithoutPassword);
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const query = { username: { $regex: new RegExp(`^${username}$`, 'i') } };
        const user = await User.findOne(query);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse(res, 400, 'Invalid credentials');
        }

        if (role === 'admin' && user.role !== 'admin') {
            return errorResponse(res, 403, 'You are not authorized as admin')
        }

        if (role === 'user' && user.role !== 'user') {
            return errorResponse(res, 403, 'You are not authorized as admin')
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();
        successResponse(res, 'Login successful!', { token, userWithoutPassword });
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error')
    }
});

module.exports = router;
