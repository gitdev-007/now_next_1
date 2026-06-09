const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/signup - User registration
router.post('/signup', authLimiter, signupValidator, authController.signup);

// POST /api/auth/login - User authentication
router.post('/login', authLimiter, loginValidator, authController.login);

// POST /api/auth/logout - Invalidate sessions
router.post('/logout', authController.logout);

// POST /api/auth/forgot-password - Trigger reset flow
router.post('/forgot-password', authLimiter, authController.forgotPassword);

// POST /api/auth/reset-password - Process password update
router.post('/reset-password', authLimiter, authController.resetPassword);

module.exports = router;
