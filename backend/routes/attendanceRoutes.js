import express from 'express';
import {
    checkIn,
    getMyAttendance,
    getUserAttendance,
    markAttendanceForUser,
    getTodayAttendance,
} from '../controllers/attendanceController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/attendance/check-in
// @desc    Member checks themselves in today
router.post('/check-in', protect, checkIn);

// @route   GET /api/attendance/my-history
// @desc    Member's own attendance history
router.get('/my-history', protect, getMyAttendance);

// @route   GET /api/attendance/today
// @desc    Admin: who has checked in today
router.get('/today', protect, isAdmin, getTodayAttendance);

// @route   GET /api/attendance/user/:id
// @desc    Admin: a member's attendance history
router.get('/user/:id', protect, isAdmin, getUserAttendance);

// @route   POST /api/attendance/mark/:id
// @desc    Admin: mark a member present (front-desk check-in)
router.post('/mark/:id', protect, isAdmin, markAttendanceForUser);

export default router;