const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/match', require('./routes/match'));
app.use('/api/ai', require('./routes/ai'));

// Root route for API health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running', message: 'Backend is up and running.' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(process.env.PORT || 5001, () => {
      console.log('Server running on port 5001');
    });
  })
  .catch(err => console.error('MongoDB connection failed:', err.message));
