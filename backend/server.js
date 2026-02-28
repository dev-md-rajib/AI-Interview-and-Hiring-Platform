require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const errorHandler = require('./src/middleware/errorHandler');
const activityLogger = require('./src/middleware/activityLogger');

// Route imports
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const interviewRoutes = require('./src/routes/interviews');
const aiAgentInterviewRoutes = require('./src/routes/aiAgentInterviews');
const jobRoutes = require('./src/routes/jobs');
const adminRoutes = require('./src/routes/admin');
const messageRoutes = require('./src/routes/messages');
const contestRoutes = require('./src/routes/contests');

// Connect DB
connectDB();

// Create logs dir
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Create uploads dir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Activity logging (for authenticated routes)
app.use(activityLogger);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/interviews/ai-agent', aiAgentInterviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contests', contestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AI Hiring Platform API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
