require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/personal-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/register', require('./routes/register'));
app.use('/api/user', require('./routes/user')); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
