import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please provide a first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please provide a last name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
        },
        password: {
            type: String,
            minlength: 6,
            select: false, // Don't return password by default
        },
        googleId: {
            type: String,
            sparse: true,
        },
        googleEmail: String,
        profileImage: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: '',
        },
        zipCode: {
            type: String,
            default: '',
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        registeredPlans: [
            {
                planId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Plan',
                },
                registeredDate: {
                    type: Date,
                    default: Date.now,
                },
                expiryDate: Date,
                status: {
                    type: String,
                    enum: ['active', 'expired', 'cancelled'],
                    default: 'active',
                },
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Set automatically by the attendance cron job when a member misses
        // too many consecutive days at the gym. Kept separate from a manual
        // admin deactivation so we know whether attending again should
        // auto-reactivate the account.
        autoInactive: {
            type: Boolean,
            default: false,
        },
        // When the member became inactive (manually or automatically).
        // Used to work out how many days to add back to a paused plan.
        inactiveSince: {
            type: Date,
            default: null,
        },
        // Most recent gym check-in date, used to detect inactivity.
        lastAttendanceDate: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};

const User = mongoose.model('User', userSchema);
export default User;