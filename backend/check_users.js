const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const users = await User.find({}, 'email role employeeId'); // Select only specific fields

        console.log('\n--- Registered Users ---');
        users.forEach(u => {
            console.log(`Email: ${u.email} | Role: ${u.role} | ID: ${u.employeeId}`);
        });

        if (users.length === 0) {
            console.log('No users found in the database.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkUsers();
