const express = require('express');
const router = express.Router();
const petRoutes = require('./petRoutes');
const authRoutes = require('./authRoutes');

// API Routes
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);

module.exports = router;
