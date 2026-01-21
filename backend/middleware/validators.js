import { body, param, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Blueprint validation rules
export const blueprintValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Blueprint name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Blueprint name must be between 3 and 100 characters'),

    body('fields')
        .isArray({ min: 1 })
        .withMessage('Blueprint must have at least one field'),

    body('fields.*.type')
        .isIn(['text', 'date', 'signature', 'checkbox'])
        .withMessage('Invalid field type'),

    body('fields.*.label')
        .trim()
        .notEmpty()
        .withMessage('Field label is required'),

    body('fields.*.position.x')
        .isNumeric()
        .withMessage('Position X must be a number'),

    body('fields.*.position.y')
        .isNumeric()
        .withMessage('Position Y must be a number'),

    validate
];

// Contract creation validation
export const contractCreationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Contract name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Contract name must be between 3 and 100 characters'),

    body('blueprintId')
        .notEmpty()
        .withMessage('Blueprint ID is required')
        .isMongoId()
        .withMessage('Invalid blueprint ID'),

    validate
];

// Contract update validation
export const contractUpdateValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid contract ID'),

    body('fields')
        .optional()
        .isArray()
        .withMessage('Fields must be an array'),

    validate
];

// State transition validation
export const stateTransitionValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid contract ID'),

    body('newState')
        .notEmpty()
        .withMessage('New state is required')
        .isIn(['created', 'approved', 'sent', 'signed', 'locked', 'revoked'])
        .withMessage('Invalid state'),

    validate
];

// ID parameter validation
export const idValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID'),

    validate
];
