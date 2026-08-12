import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { resumeMembership } from '../utils/membershipStatus.js';

function startOfDay(d = new Date()) {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    return day;
}

// @route   POST /api/attendance/check-in
// @desc    Logged-in member checks themselves in for today
export const checkIn = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = startOfDay();

        const existing = await Attendance.findOne({ userId, date: today });
        if (existing) {
            return res.status(200).json({
                success: true,
                message: 'Already checked in today',
                attendance: existing,
            });
        }

        const attendance = await Attendance.create({
            userId,
            date: today,
            markedBy: 'self',
        });

        const user = await User.findById(userId);
        user.lastAttendanceDate = new Date();

        // Checking in again after being auto-flagged inactive for missing
        // days reactivates the account and unpauses the plan. A manual
        // admin deactivation is left alone - only an admin can lift that.
        if (!user.isActive && user.autoInactive) {
            await user.save();
            await resumeMembership(userId, 'auto');
        } else {
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: 'Checked in successfully',
            attendance,
        });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking in',
            error: error.message,
        });
    }
};

// @route   GET /api/attendance/my-history
// @desc    Logged-in member's attendance history
export const getMyAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ userId: req.user._id }).sort({
            date: -1,
        });
        res.status(200).json({ success: true, attendance: records });
    } catch (error) {
        console.error('Get my attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance',
            error: error.message,
        });
    }
};

// @route   GET /api/attendance/user/:id
// @desc    Admin: attendance history for a specific member
export const getUserAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({
            userId: req.params.id,
        }).sort({ date: -1 });

        const user = await User.findById(req.params.id).select(
            'firstName lastName isActive autoInactive inactiveSince lastAttendanceDate'
        );

        res.status(200).json({ success: true, member: user, attendance: records });
    } catch (error) {
        console.error('Get user attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching member attendance',
            error: error.message,
        });
    }
};

// @route   POST /api/attendance/mark/:id
// @desc    Admin: mark a member present (front-desk check-in, e.g. no app)
export const markAttendanceForUser = async (req, res) => {
    try {
        const { date } = req.body; // optional, defaults to today
        const day = startOfDay(date ? new Date(date) : new Date());
        const userId = req.params.id;

        const attendance = await Attendance.findOneAndUpdate(
            { userId, date: day },
            {
                userId,
                date: day,
                checkInTime: new Date(),
                markedBy: 'admin',
                markedByUserId: req.user._id,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        if (day.getTime() >= startOfDay().getTime()) {
            user.lastAttendanceDate = new Date();
        }

        if (!user.isActive && user.autoInactive) {
            await user.save();
            await resumeMembership(userId, 'admin');
        } else {
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Attendance marked',
            attendance,
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking attendance',
            error: error.message,
        });
    }
};

// @route   GET /api/attendance/today
// @desc    Admin: everyone who has checked in today
export const getTodayAttendance = async (req, res) => {
    try {
        const today = startOfDay();
        const records = await Attendance.find({ date: today }).populate(
            'userId',
            'firstName lastName email phone'
        );
        res.status(200).json({ success: true, attendance: records });
    } catch (error) {
        console.error('Get today attendance error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching today's attendance",
            error: error.message,
        });
    }
};

export default {
    checkIn,
    getMyAttendance,
    getUserAttendance,
    markAttendanceForUser,
    getTodayAttendance,
};