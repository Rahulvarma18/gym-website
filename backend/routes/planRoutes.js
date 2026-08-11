import express from 'express';
import { body } from 'express-validator';
import {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
} from '../controllers/planController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/plans
// @desc    Get all active plans
router.get('/', getAllPlans);

// @route   GET /api/plans/:id
// @desc    Get single plan
router.get('/:id', getPlanById);

// @route   POST /api/plans
// @desc    Create new plan (Admin only)
router.post(
    '/',
    protect,
    isAdmin,
    [
        body('name').trim().notEmpty().withMessage('Plan name is required'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Plan description is required'),
        body('duration.value').isInt({ min: 1 }).withMessage('Invalid duration'),
        body('duration.unit')
            .isIn(['days', 'months', 'years'])
            .withMessage('Invalid duration unit'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a valid number'),
        body('features').isArray().withMessage('Features must be an array'),
    ],
    createPlan
);

// @route   PUT /api/plans/:id
// @desc    Update plan (Admin only)
router.put(
    '/:id',
    protect,
    isAdmin,
    [
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Plan name is required'),
        body('description')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Plan description is required'),
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a valid number'),
    ],
    updatePlan
);

// @route   DELETE /api/plans/:id
// @desc    Delete plan (Admin only)
router.delete('/:id', protect, isAdmin, deletePlan);

export default router;