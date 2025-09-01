import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: errors.array(),
      },
    });
  }
  next();
};

export const validateGenerateResponses = [
  body('context')
    .notEmpty().withMessage('Context is required')
    .isString().withMessage('Context must be a string')
    .isLength({ min: 10, max: 2000 }).withMessage('Context must be between 10 and 2000 characters'),
  body('tone')
    .notEmpty().withMessage('Tone is required')
    .isIn(['calm-collected', 'aggressive', 'cunning', 'girly', 'sarcastic', 'intellectual', 'casual', 'professional'])
    .withMessage('Invalid tone type'),
  body('styleExamples')
    .optional()
    .isArray().withMessage('Style examples must be an array')
    .custom((value) => value.every((item: any) => typeof item === 'string'))
    .withMessage('All style examples must be strings'),
  validateRequest,
];

export const validateCreateArgument = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  body('context')
    .notEmpty().withMessage('Context is required')
    .isString().withMessage('Context must be a string')
    .isLength({ min: 10, max: 2000 }).withMessage('Context must be between 10 and 2000 characters'),
  body('tone')
    .notEmpty().withMessage('Tone is required')
    .isIn(['calm-collected', 'aggressive', 'cunning', 'girly', 'sarcastic', 'intellectual', 'casual', 'professional'])
    .withMessage('Invalid tone type'),
  body('styleExamples')
    .optional()
    .isArray().withMessage('Style examples must be an array'),
  validateRequest,
];

export const validateArgumentId = [
  param('id')
    .notEmpty().withMessage('Argument ID is required')
    .isString().withMessage('Argument ID must be a string'),
  validateRequest,
];