const express = require('express');
const router = express.Router();
const petRoutes = require('./petRoutes');
const authRoutes = require('./authRoutes');
const breedRoutes = require('./breedRoutes');

// API Routes
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/breeds', breedRoutes);

module.exports = router;

