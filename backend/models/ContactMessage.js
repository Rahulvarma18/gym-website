import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            trim: true,
            lowercase: true,
        },
        interest: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            default: '',
            trim: true,
        },
        status: {
            type: String,
            enum: ['new', 'read'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;