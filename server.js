// server.js - Main Express server

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);
app.use(auth);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products');
});

app.use('/api/products', productsRouter);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
