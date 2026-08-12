import User from '../models/User.js';
import Plan from '../models/Plan.js';
import Registration from '../models/Registration.js';
import { pauseMembership, resumeMembership } from '../utils/membershipStatus.js';

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalPlans = await Plan.countDocuments({ isActive: true });
        const totalRegistrations = await Registration.countDocuments({
            status: 'active',
        });
        const totalRevenue = await Registration.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$planPrice' } } },
        ]);

        const recentRegistrations = await Registration.find()
            .sort({ registrationDate: -1 })
            .limit(10)
            .populate('userId', 'firstName lastName email phone')
            .populate('planId', 'name price');

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalPlans,
                activeRegistrations: totalRegistrations,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
            recentRegistrations,
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/members
// @desc    Get all members with filters
export const getAllMembers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            sortBy = 'createdAt',
            order = -1,
        } = req.query;

        const skip = (page - 1) * limit;
        let query = { isAdmin: false };

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const members = await User.find(query)
            .sort({ [sortBy]: parseInt(order) })
            .skip(skip)
            .limit(parseInt(limit))
            .select(
                'firstName lastName email phone address city state zipCode dateOfBirth registeredPlans isActive createdAt lastLogin'
            );

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            members,
        });
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching members',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/members/:id
// @desc    Get member details with full information
export const getMemberDetails = async (req, res) => {
    try {
        const member = await User.findById(req.params.id).populate(
            'registeredPlans.planId'
        );

        if (!member || member.isAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Member not found',
            });
        }

        // Get all registrations for this user
        const registrations = await Registration.find({
            userId: req.params.id,
        }).populate('planId', 'name price duration');

        res.status(200).json({
            success: true,
            member,
            registrations,
        });
    } catch (error) {
        console.error('Get member details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching member details',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/plans/registrations
// @desc    Get registrations for all plans
export const getPlanRegistrations = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true });

        const plansWithMembers = await Promise.all(
            plans.map(async (plan) => {
                const registrations = await Registration.find({
                    planId: plan._id,
                    status: 'active',
                })
                    .populate('userId', 'firstName lastName email phone address city')
                    .select(
                        'userId planName planPrice registrationDate endDate status paymentStatus'
                    );

                return {
                    planId: plan._id,
                    planName: plan.name,
                    planPrice: plan.price,
                    totalMembers: registrations.length,
                    maxMembers: plan.maxMembers || 'Unlimited',
                    members: registrations,
                };
            })
        );

        res.status(200).json({
            success: true,
            plansWithMembers,
        });
    } catch (error) {
        console.error('Get plan registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching plan registrations',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/plans/:planId/members
// @desc    Get members registered for a specific plan
export const getPlanMembers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const skip = (page - 1) * limit;

        let query = { planId: req.params.planId, status: 'active' };

        const registrations = await Registration.find(query)
            .sort({ registrationDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate(
                'userId',
                'firstName lastName email phone address city state zipCode dateOfBirth'
            )
            .populate('planId', 'name price');

        const total = await Registration.countDocuments(query);

        const plan = await Plan.findById(req.params.planId);

        res.status(200).json({
            success: true,
            plan: {
                id: plan._id,
                name: plan.name,
                price: plan.price,
            },
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            members: registrations.map((reg) => ({
                registrationId: reg._id,
                userId: reg.userId._id,
                firstName: reg.userId.firstName,
                lastName: reg.userId.lastName,
                email: reg.userId.email,
                phone: reg.userId.phone,
                address: reg.userId.address,
                city: reg.userId.city,
                state: reg.userId.state,
                zipCode: reg.userId.zipCode,
                dateOfBirth: reg.userId.dateOfBirth,
                registrationDate: reg.registrationDate,
                endDate: reg.endDate,
                status: reg.status,
                paymentStatus: reg.paymentStatus,
                daysRemaining: Math.ceil(
                    (reg.endDate - new Date()) / (1000 * 60 * 60 * 24)
                ),
            })),
        });
    } catch (error) {
        console.error('Get plan members error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching plan members',
            error: error.message,
        });
    }
};

// @route   PUT /api/admin/members/:id/status
// @desc    Update member status. Deactivating pauses their plan's expiry
//          clock; reactivating resumes it and adds back the paused days.
export const updateMemberStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const existing = await User.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Member not found',
            });
        }

        const member = isActive
            ? await resumeMembership(req.params.id, 'admin')
            : await pauseMembership(req.params.id, 'admin');

        res.status(200).json({
            success: true,
            message: 'Member status updated successfully',
            member,
        });
    } catch (error) {
        console.error('Update member status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating member status',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/analytics
// @desc    Get analytics and reports
export const getAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        if (period === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            startDate.setFullYear(now.getFullYear() - 1);
        }

        // Get registrations in period
        const registrationsData = await Registration.aggregate([
            {
                $match: {
                    registrationDate: { $gte: startDate, $lte: now },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$registrationDate',
                        },
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$planPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Get plan-wise registrations
        const planWiseRegistrations = await Registration.aggregate([
            {
                $match: {
                    registrationDate: { $gte: startDate, $lte: now },
                    status: 'active',
                },
            },
            {
                $group: {
                    _id: '$planId',
                    count: { $sum: 1 },
                    revenue: { $sum: '$planPrice' },
                },
            },
            {
                $lookup: {
                    from: 'plans',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'plan',
                },
            },
            {
                $project: {
                    planName: { $arrayElemAt: ['$plan.name', 0] },
                    count: 1,
                    revenue: 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            period,
            registrationsData,
            planWiseRegistrations,
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/registrations
// @desc    Get ALL registrations with user + plan info for the admin table
export const getAllRegistrations = async (req, res) => {
    try {
        const { search = '', plan = '', status = '' } = req.query;

        let match = {};
        if (status) match.status = status;
        if (plan) match.planName = { $regex: plan, $options: 'i' };

        const registrations = await Registration.find(match)
            .sort({ endDate: 1 })
            .populate(
                'userId',
                'firstName lastName email phone isActive autoInactive lastAttendanceDate inactiveSince'
            )
            .populate('planId', 'name price duration color');

        // Apply search filter on populated fields
        let results = registrations.filter((r) => {
            if (!r.userId) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                r.userId.firstName?.toLowerCase().includes(q) ||
                r.userId.lastName?.toLowerCase().includes(q) ||
                r.userId.email?.toLowerCase().includes(q) ||
                r.userId.phone?.includes(q)
            );
        });

        const now = new Date();
        const formatted = results.map((r) => {
            const daysRemaining = Math.ceil(
                (new Date(r.endDate) - now) / (1000 * 60 * 60 * 24)
            );
            return {
                registrationId: r._id,
                userId: r.userId?._id,
                firstName: r.userId?.firstName,
                lastName: r.userId?.lastName,
                email: r.userId?.email,
                phone: r.userId?.phone,
                planName: r.planName || r.planId?.name,
                planColor: r.planId?.color,
                planPrice: r.planPrice,
                startDate: r.startDate,
                endDate: r.endDate,
                registrationDate: r.registrationDate,
                status: r.status,
                daysRemaining,
                isExpiringSoon: daysRemaining >= 0 && daysRemaining <= 3,
                memberActive: r.userId?.isActive,
                autoInactive: r.userId?.autoInactive,
                lastAttendanceDate: r.userId?.lastAttendanceDate,
                inactiveSince: r.userId?.inactiveSince,
            };
        });

        res.status(200).json({ success: true, registrations: formatted });
    } catch (error) {
        console.error('getAllRegistrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching registrations',
            error: error.message,
        });
    }
};

// @route   GET /api/admin/expiring
// @desc    Get registrations expiring within 3 days
export const getExpiringMembers = async (req, res) => {
    try {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const registrations = await Registration.find({
            status: 'active',
            endDate: { $gte: now, $lte: threeDaysFromNow },
        })
            .populate('userId', 'firstName lastName email phone')
            .populate('planId', 'name');

        const results = registrations.map((r) => ({
            registrationId: r._id,
            firstName: r.userId?.firstName,
            lastName: r.userId?.lastName,
            email: r.userId?.email,
            phone: r.userId?.phone,
            planName: r.planName || r.planId?.name,
            endDate: r.endDate,
            daysRemaining: Math.ceil(
                (new Date(r.endDate) - now) / (1000 * 60 * 60 * 24)
            ),
        }));

        res.status(200).json({ success: true, expiring: results });
    } catch (error) {
        console.error('getExpiringMembers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching expiring members',
            error: error.message,
        });
    }
};

export default {
    getDashboardStats,
    getAllMembers,
    getMemberDetails,
    getPlanRegistrations,
    getPlanMembers,
    updateMemberStatus,
    getAnalytics,
    getAllRegistrations,
    getExpiringMembers,
};