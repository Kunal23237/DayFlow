const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test connection
const testCloudinaryConnection = async () => {
    try {
        if (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET) {
            await cloudinary.api.ping();
            logger.info('Cloudinary connected successfully');
        } else {
            logger.warn('Cloudinary credentials not configured - file uploads will be disabled');
        }
    } catch (error) {
        logger.error(`Cloudinary connection error: ${error.message}`);
    }
};

testCloudinaryConnection();

module.exports = cloudinary;
