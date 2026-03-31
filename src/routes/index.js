const express = require('express');
const router = express.Router();
const petRoutes = require('./petRoutes');

// API Routes
router.use('/pets', petRoutes);

module.exports = router;
