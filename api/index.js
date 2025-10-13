const express = require('express');
const cors = require('cors');
const connectDB = require('../server/config/database');
const errorHandler = require('../server/middleware/error');

// Import routes
const authRoutes = require('../server/routes/auth');
const projectRoutes = require('../server/routes/projects');
const taskRoutes = require('../server/routes/tasks');
const userRoutes = require('../server/routes/users');
const analyticsRoutes = require('../server/routes/analytics');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Task Manager API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// Export for Vercel
module.exports = app;