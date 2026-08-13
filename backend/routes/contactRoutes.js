import express from 'express';
import {
    submitContactMessage,
    getAllMessages,
    markMessageRead,
    deleteMessage,
} from '../controllers/contactController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Public: submit the contact form
router.post('/', submitContactMessage);

// @route   GET /api/contact
// @desc    Admin: view all submissions
router.get('/', protect, isAdmin, getAllMessages);

// @route   PATCH /api/contact/:id/read
// @desc    Admin: mark a submission as read
router.patch('/:id/read', protect, isAdmin, markMessageRead);

// @route   DELETE /api/contact/:id
// @desc    Admin: delete a submission
router.delete('/:id', protect, isAdmin, deleteMessage);

export default router;