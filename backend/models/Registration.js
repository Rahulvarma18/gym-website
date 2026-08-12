import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        planName: String,
        planPrice: Number,
        registrationDate: {
            type: Date,
            default: Date.now,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled', 'pending', 'paused'],
            default: 'active',
        },
        // Set when the member's account goes inactive (no attendance, or
        // manual admin action) so the plan clock stops counting down.
        pausedAt: {
            type: Date,
            default: null,
        },
        // Running total of days this registration has been paused for.
        // Added back onto endDate whenever the member becomes active again.
        totalPausedDays: {
            type: Number,
            default: 0,
        },
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'upi', 'cash', 'online'],
            default: 'online',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'completed',
        },
        transactionId: String,
        notes: String,
        renewalDate: Date, // For auto-renewal tracking
        isAutoRenewal: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
registrationSchema.index({ userId: 1, planId: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ endDate: 1 });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;