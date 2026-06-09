const { body, validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorMiddleware');

// Helper middleware to handle the validation result
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError('Validation Error', 400, errors.array()));
  }
  next();
};

const signupValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full Name is required')
    .isLength({ min: 2 })
    .withMessage('Full Name must be at least 2 characters long'),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain at least one special character'),
    
  validateResult
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  validateResult
];

module.exports = {
  signupValidator,
  loginValidator
};
