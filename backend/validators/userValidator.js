const { body, validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorMiddleware');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError('Validation Error', 400, errors.array()));
  }
  next();
};

const updateProfileValidator = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full Name cannot be empty')
    .isLength({ min: 2 })
    .withMessage('Full Name must be at least 2 characters long'),
    
  body('avatarUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Avatar URL must be a valid URL link'),
    
  validateResult
];

module.exports = {
  updateProfileValidator
};
