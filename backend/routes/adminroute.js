const express = require('express');
const router = express.Router();
const User = require('../models/User');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function adminAuth(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// Get comprehensive admin dashboard statistics
router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({ isEmailVerified: false });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    // Get users who logged in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogins = await User.countDocuments({
      lastLoginAt: { $gte: today }
    });
    
    // Get users who logged in this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogins = await User.countDocuments({
      lastLoginAt: { $gte: weekAgo }
    });
    
    // Get recent signups (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: monthAgo }
    });
    
    
    res.json({
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      adminUsers,
      todayLogins,
      weekLogins,
      recentSignups
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get detailed user list with all information
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', verified = 'all', admin = 'all' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Verification filter
    if (verified === 'verified') {
      query.isEmailVerified = true;
    } else if (verified === 'unverified') {
      query.isEmailVerified = false;
    }
    
    // Admin filter
    if (admin === 'admin') {
      query.isAdmin = true;
    } else if (admin === 'user') {
      query.isAdmin = false;
    }
    
    
    const users = await User.find(query)
      .select('-password -resetPasswordToken -emailVerificationToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user login history
router.get('/user-logins', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'email username loginHistory lastLoginAt lastLogoutAt loginCount')
      .sort({ lastLoginAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('User logins error:', error);
    res.status(500).json({ message: 'Error fetching login history' });
  }
});

// Get user details by ID
router.get('/user/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -emailVerificationToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Toggle user admin status
router.patch('/user/:id/toggle-admin', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    res.json({ 
      message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`,
      isAdmin: user.isAdmin 
    });
  } catch (error) {
    console.error('Toggle admin error:', error);
    res.status(500).json({ message: 'Error updating admin status' });
  }
});

// Verify user email manually
router.patch('/user/:id/verify-email', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    // Send notification email to user
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        port: 587,
        secure: false,
      });

      const mailOptions = {
        to: user.email,
        subject: 'Email Verified - Craft Sales',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Successfully Verified!</h2>
            <p>Hi ${user.username},</p>
            <p>Great news! Your email address has been verified by our admin team.</p>
            <p>You can now enjoy full access to all features of Craft Sales.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3001" 
                 style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit Craft Sales
              </a>
            </div>
            <p>Thank you for joining Craft Sales!</p>
            <p>Best regards,<br>The Craft Sales Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification notification email sent to:', user.email);
    } catch (emailError) {
      console.error('Error sending verification notification email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ message: 'Email verified successfully and notification sent' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
});

// Delete user
router.delete('/user/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get user login history (detailed)
router.get('/login-history', adminAuth, async (req, res) => {
  const users = await User.find({}, 'username email loginHistory');
  res.json(users);
});

module.exports = router;