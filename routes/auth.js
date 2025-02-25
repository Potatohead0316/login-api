const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const query = { username: { $regex: new RegExp(`^${username}$`, 'i') } };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        if (role === 'admin' && user.role !== 'admin') {
            return res.status(400).json({ message: 'You are not authorized as admin', success: false });
        }

        if (role === 'user' && user.role !== 'user') {
            return res.status(400).json({ message: 'You are not authorized as customer user', success: false });
        }

        const { password: _, ...userWithoutPassword } = user.toObject(); 

        res.json({ message: 'Login successful!', success: true, data: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
