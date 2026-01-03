const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const verifyFix = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.log('MONGODB_URI not found');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const testUser = new User({
            employeeId: 'TEST_' + Date.now(),
            email: 'test_fix_' + Date.now() + '@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        });

        await testUser.save();
        console.log('✅ User saved successfully - Fix Verified');

        await User.deleteOne({ _id: testUser._id });
        console.log('Test user cleaned up');

    } catch (error) {
        console.error('❌ Error testing fix:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

verifyFix();
