const express = require('express');
const router = express.Router();
const {
    signUp,
    signIn,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateSignUp, validateSignIn } = require('../middleware/validation.middleware');

// Public routes
router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
