const mongoose = require('mongoose');
const Attendance = require('./models/Attendance.model');
const User = require('./models/User.model');
require('dotenv').config();

const checkAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find the most recent attendance for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const attendance = await Attendance.find({
            date: startOfDay
        }).populate('user', 'email employeeId');

        console.log('\n--- Today\'s Attendance Records ---');
        attendance.forEach(a => {
            console.log(`User: ${a.user?.email} (${a.user?.employeeId})`);
            console.log(`Status: ${a.status}`);
            console.log(`Check In: ${a.checkIn}`);
            console.log(`Check Out: ${a.checkOut || 'Not checked out'}`);
            console.log('-----------------------------------');
        });

        if (attendance.length === 0) {
            console.log('No attendance records found for today.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkAttendance();
