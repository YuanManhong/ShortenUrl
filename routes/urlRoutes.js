
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { authenticate } = require('../auth/authController');
const rateLimiter = require('../middleware/rateLimiter');

// Endpoint to create a short URL
router.post('/shorten', authenticate, rateLimiter, urlController.shortenUrl);

// Endpoint to get the history of shortened URLs by the user
router.get('/history', authenticate, urlController.getUserUrls);

module.exports = router;
