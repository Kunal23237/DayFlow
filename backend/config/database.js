const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        // Check if MongoDB URI is provided
        if (!process.env.MONGODB_URI) {
            logger.warn('MongoDB URI not provided. Database connection skipped.');
            console.log('⚠️  MongoDB URI not configured. Please set MONGODB_URI in .env file');
            console.log('   The server will run without database connection.');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options are no longer needed in Mongoose 6+
            // but keeping them for compatibility
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        console.log('   The server will run without database connection.');
        console.log('   Please check your MONGODB_URI in .env file\n');
    }
};

module.exports = connectDB;
