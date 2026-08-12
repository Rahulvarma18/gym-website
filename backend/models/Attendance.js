import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Calendar day the check-in belongs to (time zeroed out) so we can
        // enforce "one attendance record per user per day" and query fast.
        date: {
            type: Date,
            required: true,
        },
        checkInTime: {
            type: Date,
            default: Date.now,
        },
        markedBy: {
            type: String,
            enum: ['self', 'admin'],
            default: 'self',
        },
        // Admin who logged it, if markedBy === 'admin'.
        markedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;