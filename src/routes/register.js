const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { errorResponse, successResponse } = require('../helper/helper');

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })

        if (existingUser) {
            return errorResponse(res, 400, 'Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: role
        })

        await newUser.save()

        const { password, ...userWithoutPassword } = newUser.toObject();
        successResponse(res, 'User registered successfully!', userWithoutPassword);
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error');
    }
})

module.exports = router