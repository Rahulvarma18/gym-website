import ContactMessage from '../models/ContactMessage.js';

// @route   POST /api/contact
// @desc    Public: submit the contact form
export const submitContactMessage = async (req, res) => {
    try {
        const { name, email, interest, message } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required',
            });
        }

        const contact = await ContactMessage.create({
            name: name.trim(),
            email: email.trim(),
            interest: interest || '',
            message: message?.trim() || '',
        });

        res.status(201).json({
            success: true,
            message: 'Message received',
            contact,
        });
    } catch (error) {
        console.error('Submit contact message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message,
        });
    }
};

// @route   GET /api/contact
// @desc    Admin: list all contact form submissions, newest first
export const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
        const unreadCount = await ContactMessage.countDocuments({ status: 'new' });

        res.status(200).json({
            success: true,
            count: messages.length,
            unreadCount,
            messages,
        });
    } catch (error) {
        console.error('Get contact messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message,
        });
    }
};

// @route   PATCH /api/contact/:id/read
// @desc    Admin: mark a message as read
export const markMessageRead = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({ success: true, contact: message });
    } catch (error) {
        console.error('Mark message read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message',
            error: error.message,
        });
    }
};

// @route   DELETE /api/contact/:id
// @desc    Admin: delete a message
export const deleteMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message',
            error: error.message,
        });
    }
};

export default {
    submitContactMessage,
    getAllMessages,
    markMessageRead,
    deleteMessage,
};