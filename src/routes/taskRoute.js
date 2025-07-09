const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { errorResponse, successResponse } = require('../helper/helper');
const verifyToken = require('../middleware/authMiddleWare');
const mongoose = require('mongoose');
const Task = require('../models/Task');

router.get('/list', async (req, res) => {
  try {
    const list = await Task.find();

    if (!list || list.length === 0) {
      return errorResponse(res, 404, 'No items found');
    }

    // Group tasks by status
    const grouped = list.reduce((acc, task) => {
      const status = task.status || 'UNCATEGORIZED';
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {});

    console.log('grouped list', grouped);

    successResponse(res, 'Tasks retrieved successfully', grouped);
  } catch (error) {
    errorResponse(res, 500, 'Internal server error');
  }
});

router.put('/move-task', async (req, res) => {
  const { id, status } = req.body;
  try {
    const updated = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return errorResponse(res, 404, 'Task not found');
    }
    successResponse(res, 'Task moved successfully', updated);
  } catch (err) {
    errorResponse(res, 500, 'Failed to move task');
  }
});

module.exports = router;
