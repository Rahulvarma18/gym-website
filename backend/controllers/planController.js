import Plan from '../models/Plan.js';
import { validationResult } from 'express-validator';

// @route   GET /api/plans
// @desc    Get all active plans
export const getAllPlans = async (req, res) => {
    try {
        const { search, sortBy = 'price', order = 'asc' } = req.query;

        let query = { isActive: true };

        if (search) {
            query.$text = { $search: search };
        }

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const plans = await Plan.find(query)
            .sort(sortObj)
            .populate('createdBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            count: plans.length,
            plans,
        });
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching plans',
            error: error.message,
        });
    }
};

// @route   GET /api/plans/:id
// @desc    Get single plan
export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id).populate(
            'createdBy',
            'firstName lastName email'
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found',
            });
        }

        res.status(200).json({
            success: true,
            plan,
        });
    } catch (error) {
        console.error('Get plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching plan',
            error: error.message,
        });
    }
};

// @route   POST /api/plans
// @desc    Create new plan (Admin only)
export const createPlan = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const {
            name,
            description,
            duration,
            price,
            discountPrice,
            features,
            maxMembers,
            accessHours,
            color,
            badge,
        } = req.body;

        // Check if plan already exists
        const existingPlan = await Plan.findOne({ name });
        if (existingPlan) {
            return res.status(400).json({
                success: false,
                message: 'Plan with this name already exists',
            });
        }

        const plan = await Plan.create({
            name,
            description,
            duration,
            price,
            discountPrice,
            features,
            maxMembers,
            accessHours,
            color,
            badge,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            plan,
        });
    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating plan',
            error: error.message,
        });
    }
};

// @route   PUT /api/plans/:id
// @desc    Update plan (Admin only)
export const updatePlan = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found',
            });
        }

        // Update plan
        const updatedPlan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Plan updated successfully',
            plan: updatedPlan,
        });
    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating plan',
            error: error.message,
        });
    }
};

// @route   DELETE /api/plans/:id
// @desc    Delete plan (Admin only)
export const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found',
            });
        }

        // Soft delete - mark as inactive instead of hard delete
        plan.isActive = false;
        await plan.save();

        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully',
        });
    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting plan',
            error: error.message,
        });
    }
};

export default {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
};