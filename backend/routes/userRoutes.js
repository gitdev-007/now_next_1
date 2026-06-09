const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { updateProfileValidator } = require('../validators/userValidator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protect all profile endpoints with JWT verification
router.use(authenticateToken);

// GET /api/user/profile - Fetch details
router.get('/profile', apiLimiter, userController.getProfile);

// PUT /api/user/profile - Update details
router.put('/profile', apiLimiter, updateProfileValidator, userController.updateProfile);

module.exports = router;
