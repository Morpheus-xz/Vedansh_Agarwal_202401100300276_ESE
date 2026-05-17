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

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  } else {
    next();
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(process.env.PORT || 5001, () => {
      console.log('Server running on port 5001');
    });
  })
  .catch(err => console.error('MongoDB connection failed:', err.message));
