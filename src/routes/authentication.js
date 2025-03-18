const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { errorResponse, successResponse } = require('../helper/helper');

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

        const { password: _, ...userWithoutPassword } = user.toObject(); 

        successResponse(res, 'Login successful!', userWithoutPassword);
        
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error')
    }
});


module.exports = router;
