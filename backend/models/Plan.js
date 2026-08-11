import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a plan name'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a plan description'],
        },
        duration: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                enum: ['days', 'months', 'years'],
                default: 'months',
            },
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: 0,
        },
        discountPrice: {
            type: Number,
            default: null,
            min: 0,
        },
        features: [
            {
                type: String,
            },
        ],
        maxMembers: {
            type: Number,
            default: null, // null means unlimited
        },
        currentMembers: {
            type: Number,
            default: 0,
        },
        accessHours: {
            type: String,
            default: '24/7',
        },
        color: {
            type: String,
            default: '#10b981',
        },
        badge: {
            type: String,
            default: null, // e.g., "POPULAR", "BEST VALUE"
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
planSchema.index({ isActive: 1 });
planSchema.index({ name: 'text' });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;