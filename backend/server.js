const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (err) {
  console.warn('Razorpay module not found — payment endpoints disabled.');
}
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// Load environment variables from backend/config.env or backend/.env when running locally
try {
  // require dotenv only when available to avoid crashing in environments where it's not installed
  // This will load config from 'config.env' for backwards compatibility, or '.env' otherwise.
  // eslint-disable-next-line global-require
  const dotenv = require('dotenv');
  const envPath = require('fs').existsSync(path.join(__dirname, 'config.env'))
    ? path.join(__dirname, 'config.env')
    : path.join(__dirname, '.env');
  dotenv.config({ path: envPath });
  console.log('Loaded environment variables from', envPath);
} catch (err) {
  // If dotenv is not installed in the environment (e.g., production platform sets env vars), continue.
  console.log('dotenv not loaded (may be running in production where environment variables are provided)');
}

// Define PORT
const PORT = process.env.PORT || 5001;

// Create express app and basic middleware (ensure these are defined before using `app`)
const app = express();
app.use(cors({
  origin: "https://craftsales-online-hsld.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Also serve images from the specific images subdirectory
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));



// Import User model
const User = require('./models/user');

// Routes

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body); // Debug log

    const { username, email, mobile, address, password } = req.body;

    // Check for missing fields
    if (!username || !email || !mobile || !address || !password) {
      console.log('Signup error: Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup error: User with this email already exists');
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate 6-digit email verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user
    const newUser = new User({
      username,
      email,
      mobile,
      address,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: verificationExpires
    });

    await newUser.save();

    // Send verification email in background (non-blocking)
    setImmediate(async () => {
      try {
        console.log('Attempting to send verification email to:', newUser.email);
        console.log('Email config - User:', process.env.EMAIL_USER);
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          port: 587,
          secure: false,
        });

        const mailOptions = {
          to: newUser.email,
          subject: 'Your Craft Sales verification code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Welcome to Craft Sales!</h2>
              <p>Hi ${newUser.username},</p>
              <p>Your verification code is:</p>
              <div style="text-align: center; margin: 24px 0; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #667eea;">
                ${verificationCode}
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't create an account, you can ignore this email.</p>
            </div>
          `
        };

        const emailResult = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', newUser.email);
        console.log('Email result:', emailResult.messageId);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        console.error('Email error details:', emailError.message);
      }
    });

    console.log('User created successfully:', newUser.email);
    res.status(201).json({ 
      message: 'User created successfully. Enter the verification code sent to your email to activate your account.',
      requiresVerification: true,
      email: newUser.email
    });
  } catch (error) {
    // Improved error logging
    if (error.name === 'ValidationError') {
      console.log('Signup error: ValidationError', error.message);
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      console.log('Signup error: Duplicate email');
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body); // Debug log

    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      console.log('Login error: Missing fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login error: User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login error: Invalid password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email with the 6-digit code we sent before logging in.' });
    }

    // Track login information
    const loginTime = new Date();
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Add login session to history
    user.loginHistory.push({
      loginAt: loginTime,
      ipAddress: ipAddress,
      userAgent: userAgent
    });

    // Update user login tracking
    user.lastLoginAt = loginTime;
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    console.log('Login successful for:', user.email);
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Logout endpoint with tracking
app.post('/api/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const logoutTime = new Date();
        user.lastLogoutAt = logoutTime;
        
        // Update the last login session with logout time and calculate duration
        if (user.loginHistory.length > 0) {
          const lastSession = user.loginHistory[user.loginHistory.length - 1];
          if (lastSession.loginAt && !lastSession.logoutAt) {
            lastSession.logoutAt = logoutTime;
            const sessionDuration = Math.round((logoutTime - lastSession.loginAt) / (1000 * 60)); // in minutes
            lastSession.sessionDuration = sessionDuration;
          }
        }
        
        await user.save();
      }
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.json({ message: 'Logged out successfully' }); // Still respond success even if tracking fails
  }
});

// Reset Password endpoint
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  const saltRounds = 10;
  user.password = await bcrypt.hash(password, saltRounds);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully." });
});

// Email verification via code
app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code expired. Please request a new one.' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
});

// Resend verification email endpoint
app.post('/api/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationExpires;
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
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
      subject: 'Your Craft Sales verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email - Craft Sales</h2>
          <p>Hi ${user.username},</p>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 24px 0; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #667eea;">
            ${verificationCode}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Error sending verification email' });
  }
});

// Forgot Password endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If this email exists, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      port: 587,
      secure: false, // use TLS
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://craftsales-online-hsld.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "If this email exists, a reset link has been sent." });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
});

// Product upload route is handled in uploadRoutes.js

const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Cart routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// Admin routes
const adminRoutes = require('./routes/adminroute');
app.use('/api/admin', adminRoutes);

// Seller routes - Added per suggestion
const sellerRoutes = require('./routes/sellerRoutes');
app.use('/api/seller', sellerRoutes);

// Import routes
const uploadRoutes = require('./routes/uploadRoutes');

// Register routes
app.use('/api/upload', uploadRoutes);

// Razorpay: create order endpoint
app.post('/api/pay/create-order', async (req, res) => {
  if (!Razorpay) return res.status(503).json({ message: 'Payments not available' });
  try {
    const { amount } = req.body;
    const amt = Math.max(1, parseInt(amount || 0, 10));
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: amt * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({ order });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});