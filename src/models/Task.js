const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema, 'tasks');
module.exports = Task;
