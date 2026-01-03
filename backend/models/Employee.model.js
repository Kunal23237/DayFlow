const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        // Personal Details
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        },
        phone: {
            type: String,
            trim: true,
        },
        alternatePhone: {
            type: String,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
        },
        emergencyContact: {
            name: String,
            relationship: String,
            phone: String,
        },

        // Job Details
        department: {
            type: String,
            required: [true, 'Department is required'],
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
        },
        joiningDate: {
            type: Date,
            required: [true, 'Joining date is required'],
            default: Date.now,
        },
        employmentType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
            default: 'Full-time',
        },
        workLocation: {
            type: String,
        },
        reportingManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
        },

        // Profile & Documents
        profilePicture: {
            url: String,
            publicId: String, // Cloudinary public ID
        },
        documents: [
            {
                name: String,
                type: {
                    type: String,
                    enum: ['ID Proof', 'Address Proof', 'Education Certificate', 'Experience Letter', 'Other'],
                },
                url: String,
                publicId: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Leave Balance
        leaveBalance: {
            paid: {
                type: Number,
                default: 20, // 20 paid leaves per year
            },
            sick: {
                type: Number,
                default: 10, // 10 sick leaves per year
            },
            casual: {
                type: Number,
                default: 5, // 5 casual leaves per year
            },
        },

        // Status
        status: {
            type: String,
            enum: ['Active', 'On Leave', 'Resigned', 'Terminated'],
            default: 'Active',
        },
        exitDate: Date,
        exitReason: String,
    },
    {
        timestamps: true,
    }
);

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

// Index for faster queries
employeeSchema.index({ user: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
