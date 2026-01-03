const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        checkIn: {
            type: Date,
        },
        checkOut: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Half-day', 'Leave', 'Holiday', 'Weekend'],
            default: 'Absent',
        },
        workingHours: {
            type: Number, // in hours
            default: 0,
        },
        isLate: {
            type: Boolean,
            default: false,
        },
        lateBy: {
            type: Number, // in minutes
            default: 0,
        },
        remarks: {
            type: String,
            trim: true,
        },
        location: {
            checkIn: {
                latitude: Number,
                longitude: Number,
                address: String,
            },
            checkOut: {
                latitude: Number,
                longitude: Number,
                address: String,
            },
        },
        // For manual attendance marking by admin
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isManualEntry: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate working hours before saving
// Calculate working hours before saving
attendanceSchema.pre('save', async function () {
    if (this.checkIn && this.checkOut) {
        const diffMs = this.checkOut - this.checkIn;

        this.workingHours =
            Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // 2 decimals

        // Update status based on working hours
        if (this.workingHours >= 8) {
            this.status = 'Present';
        } else if (this.workingHours >= 4) {
            this.status = 'Half-day';
        }
    }
});


// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ user: 1, date: -1 });
attendanceSchema.index({ status: 1 });

// Static method to get attendance summary
attendanceSchema.statics.getAttendanceSummary = async function (employeeId, startDate, endDate) {
    return await this.aggregate([
        {
            $match: {
                employee: mongoose.Types.ObjectId(employeeId),
                date: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalHours: { $sum: '$workingHours' },
            },
        },
    ]);
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
