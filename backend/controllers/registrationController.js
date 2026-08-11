import Registration from '../models/Registration.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';

// @route   POST /api/registrations
// @desc    Register user for a plan (creates pending registration)
export const registerForPlan = async (req, res) => {
    try {
        const { planId, planName, planPrice, paymentMethod = 'cash' } = req.body;

        let plan = null;
        if (planId) {
            plan = await Plan.findById(planId);
        } else if (planName) {
            plan = await Plan.findOne({ name: { $regex: new RegExp(`^${planName}$`, 'i') } });
            if (!plan) {
                // Determine duration & price defaults for Weekly/Monthly/Yearly tiers
                let duration = { value: 1, unit: 'months' };
                let priceVal = 1499;
                if (planName.toLowerCase() === 'weekly') {
                    duration = { value: 7, unit: 'days' };
                    priceVal = 399;
                } else if (planName.toLowerCase() === 'yearly') {
                    duration = { value: 1, unit: 'years' };
                    priceVal = 12999;
                }
                plan = await Plan.create({
                    name: planName,
                    description: `${planName} gym package`,
                    price: planPrice || priceVal,
                    duration,
                });
            }
        }

        if (!plan) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid plan',
            });
        }

        // Check if user already has an active or pending registration for ANY plan
        const anyActiveOrPending = await Registration.findOne({
            userId: req.user._id,
            status: { $in: ['pending', 'active'] },
        });

        if (anyActiveOrPending) {
            if (anyActiveOrPending.status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'You can only select another plan after your current plan expires.',
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'You already have a pending plan request awaiting payment approval.',
                });
            }
        }

        // Default duration calculation
        const startDate = new Date();
        const endDate = new Date();
        if (plan.duration?.unit === 'days') {
            endDate.setDate(endDate.getDate() + (plan.duration.value || 7));
        } else if (plan.duration?.unit === 'years') {
            endDate.setFullYear(endDate.getFullYear() + (plan.duration.value || 1));
        } else {
            endDate.setMonth(endDate.getMonth() + (plan.duration?.value || 1));
        }

        // Create pending registration
        const registration = await Registration.create({
            userId: req.user._id,
            planId: plan._id,
            planName: plan.name,
            planPrice: plan.discountPrice || plan.price,
            startDate,
            endDate,
            paymentMethod,
            paymentStatus: 'pending',
            status: 'pending',
        });

        res.status(201).json({
            success: true,
            message: 'Plan selected! Registration is pending admin payment confirmation.',
            registration,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering for plan',
            error: error.message,
        });
    }
};

// @route   GET /api/registrations/my-plans
// @desc    Get user's registered plans
export const getUserPlans = async (req, res) => {
    try {
        const registrations = await Registration.find({
            userId: req.user._id,
        })
            .populate('planId')
            .sort({ registrationDate: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            registrations,
        });
    } catch (error) {
        console.error('Get user plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your plans',
            error: error.message,
        });
    }
};

// @route   GET /api/registrations/:id
// @desc    Get registration details
export const getRegistrationDetails = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id)
            .populate('userId', 'firstName lastName email phone address')
            .populate('planId');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found',
            });
        }

        // Check if user owns this registration
        if (
            registration.userId._id.toString() !== req.user._id.toString() &&
            !req.user.isAdmin
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this registration',
            });
        }

        res.status(200).json({
            success: true,
            registration,
        });
    } catch (error) {
        console.error('Get registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching registration',
            error: error.message,
        });
    }
};

// @route   PUT /api/registrations/:id/renew
// @desc    Renew a plan registration
export const renewRegistration = async (req, res) => {
    try {
        const { durationMonths = 1 } = req.body;

        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found',
            });
        }

        // Check ownership
        if (
            registration.userId.toString() !== req.user._id.toString() &&
            !req.user.isAdmin
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to renew this registration',
            });
        }

        // Calculate new end date
        const newEndDate = new Date(registration.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

        registration.endDate = newEndDate;
        registration.renewalDate = new Date();
        registration.status = 'active';

        await registration.save();

        // Update user's plan expiry
        await User.findByIdAndUpdate(
            registration.userId,
            {
                $set: {
                    'registeredPlans.$[elem].expiryDate': newEndDate,
                    'registeredPlans.$[elem].status': 'active',
                },
            },
            {
                arrayFilters: [{ 'elem.planId': registration.planId }],
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Registration renewed successfully',
            registration,
        });
    } catch (error) {
        console.error('Renew registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error renewing registration',
            error: error.message,
        });
    }
};

// @route   PUT /api/registrations/:id/cancel
// @desc    Cancel a plan registration
export const cancelRegistration = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found',
            });
        }

        // Check ownership
        if (
            registration.userId.toString() !== req.user._id.toString() &&
            !req.user.isAdmin
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this registration',
            });
        }

        registration.status = 'cancelled';
        await registration.save();

        // Update user's plan status
        await User.findByIdAndUpdate(
            registration.userId,
            {
                $set: {
                    'registeredPlans.$[elem].status': 'cancelled',
                },
            },
            {
                arrayFilters: [{ 'elem.planId': registration.planId }],
                new: true,
            }
        );

        // Decrease plan member count
        await Plan.findByIdAndUpdate(registration.planId, {
            $inc: { currentMembers: -1 },
        });

        res.status(200).json({
            success: true,
            message: 'Registration cancelled successfully',
        });
    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling registration',
            error: error.message,
        });
    }
};

// @route   PUT /api/registrations/:id/activate
// @desc    Activate pending registration (Admin only after receiving payment)
export const activateRegistration = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found',
            });
        }

        const plan = await Plan.findById(registration.planId);
        const startDate = new Date();
        const endDate = new Date();

        let durationValue = 1;
        let durationUnit = 'months';
        if (plan && plan.duration) {
            durationValue = plan.duration.value || 1;
            durationUnit = plan.duration.unit || 'months';
        } else if (registration.planName?.toLowerCase().includes('weekly')) {
            durationValue = 7;
            durationUnit = 'days';
        } else if (registration.planName?.toLowerCase().includes('yearly')) {
            durationValue = 1;
            durationUnit = 'years';
        }

        if (durationUnit === 'days') {
            endDate.setDate(endDate.getDate() + durationValue);
        } else if (durationUnit === 'years') {
            endDate.setFullYear(endDate.getFullYear() + durationValue);
        } else {
            endDate.setMonth(endDate.getMonth() + durationValue);
        }

        registration.status = 'active';
        registration.paymentStatus = 'completed';
        registration.startDate = startDate;
        registration.endDate = endDate;
        await registration.save();

        // Update user's registered plans
        await User.findByIdAndUpdate(
            registration.userId,
            {
                $push: {
                    registeredPlans: {
                        planId: registration.planId,
                        registeredDate: startDate,
                        expiryDate: endDate,
                        status: 'active',
                    },
                },
            },
            { new: true }
        );

        if (plan) {
            plan.currentMembers = (plan.currentMembers || 0) + 1;
            await plan.save();
        }

        res.status(200).json({
            success: true,
            message: 'Registration activated and payment completed successfully',
            registration,
        });
    } catch (error) {
        console.error('Activate registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error activating registration',
            error: error.message,
        });
    }
};

export default {
    registerForPlan,
    getUserPlans,
    getRegistrationDetails,
    renewRegistration,
    cancelRegistration,
    activateRegistration,
};