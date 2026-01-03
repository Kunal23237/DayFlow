const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        logger.warn('Email credentials not configured - email service disabled');
        return null;
    }

    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

const transporter = createTransporter();

// Send email verification
const sendVerificationEmail = async (email, token, name) => {
    if (!transporter) {
        logger.warn('Email service not configured - skipping verification email');
        return { success: false, message: 'Email service not configured' };
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Email - Dayflow HRMS',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Dayflow HRMS!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Dayflow HRMS. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Verification email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error(`Error sending verification email: ${error.message}`);
        return { success: false, message: error.message };
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token, name) => {
    if (!transporter) {
        logger.warn('Email service not configured - skipping password reset email');
        return { success: false, message: 'Email service not configured' };
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request - Dayflow HRMS',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Password reset email sent to ${email}`);
        return { success: true };
    } catch (error) {
        logger.error(`Error sending password reset email: ${error.message}`);
        return { success: false, message: error.message };
    }
};

// Send leave notification to admin
const sendLeaveNotification = async (adminEmail, employeeName, leaveType, dates) => {
    if (!transporter) return { success: false };

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: adminEmail,
        subject: `New Leave Request - ${employeeName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Leave Request</h2>
        <p><strong>${employeeName}</strong> has submitted a leave request:</p>
        <ul>
          <li><strong>Type:</strong> ${leaveType}</li>
          <li><strong>Dates:</strong> ${dates}</li>
        </ul>
        <p>Please log in to the admin dashboard to review and approve/reject this request.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        logger.error(`Error sending leave notification: ${error.message}`);
        return { success: false };
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendLeaveNotification,
};
