const express = require('express');
const router = express.Router();
const petRoutes = require('./petRoutes');
const authRoutes = require('./authRoutes');
const breedRoutes = require('./breedRoutes');
const serviceRoutes = require('./serviceRoutes');

// API Routes
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/breeds', breedRoutes);
router.use('/services', serviceRoutes);

module.exports = router;

