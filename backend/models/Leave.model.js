const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
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
        leaveType: {
            type: String,
            enum: ['Paid', 'Sick', 'Casual', 'Unpaid', 'Maternity', 'Paternity'],
            required: [true, 'Leave type is required'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        numberOfDays: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: [true, 'Reason is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
            default: 'Pending',
        },
        // Admin actions
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: Date,
        adminComments: {
            type: String,
            trim: true,
        },
        // Supporting documents
        documents: [
            {
                name: String,
                url: String,
                publicId: String,
            },
        ],
        // Half day option
        isHalfDay: {
            type: Boolean,
            default: false,
        },
        halfDaySession: {
            type: String,
            enum: ['Morning', 'Afternoon'],
        },
    },
    {
        timestamps: true,
    }
);

// Calculate number of days before saving
leaveSchema.pre('save', function (next) {
    if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate - this.startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

        if (this.isHalfDay) {
            this.numberOfDays = 0.5;
        } else {
            this.numberOfDays = diffDays;
        }
    }
    next();
});

// Validate end date is after start date
leaveSchema.pre('save', function (next) {
    if (this.endDate < this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

// Index for faster queries
leaveSchema.index({ employee: 1, status: 1 });
leaveSchema.index({ user: 1, createdAt: -1 });
leaveSchema.index({ status: 1, createdAt: -1 });

// Static method to get leave statistics
leaveSchema.statics.getLeaveStats = async function (employeeId, year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    return await this.aggregate([
        {
            $match: {
                employee: mongoose.Types.ObjectId(employeeId),
                status: 'Approved',
                startDate: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: '$leaveType',
                totalDays: { $sum: '$numberOfDays' },
                count: { $sum: 1 },
            },
        },
    ]);
};

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
