import express from 'express';
import { body } from 'express-validator';
import {
    getDashboardStats,
    getAllMembers,
    getMemberDetails,
    getPlanRegistrations,
    getPlanMembers,
    updateMemberStatus,
    getAnalytics,
    getAllRegistrations,
    getExpiringMembers,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(protect, isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/members
// @desc    Get all members with filters
router.get('/members', getAllMembers);

// @route   GET /api/admin/members/:id
// @desc    Get member details with full information
router.get('/members/:id', getMemberDetails);

// @route   PUT /api/admin/members/:id/status
// @desc    Update member status
router.put(
    '/members/:id/status',
    [body('isActive').isBoolean().withMessage('isActive must be a boolean')],
    updateMemberStatus
);

// @route   GET /api/admin/plans/registrations
// @desc    Get registrations for all plans
router.get('/plans/registrations', getPlanRegistrations);

// @route   GET /api/admin/plans/:planId/members
// @desc    Get members registered for a specific plan
router.get('/plans/:planId/members', getPlanMembers);

// @route   GET /api/admin/analytics
// @desc    Get analytics and reports
router.get('/analytics', getAnalytics);

// @route   GET /api/admin/registrations
// @desc    Get all registrations for admin table
router.get('/registrations', getAllRegistrations);

// @route   GET /api/admin/expiring
// @desc    Get members whose plans expire within 3 days
router.get('/expiring', getExpiringMembers);

export default router;