const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./middleware/corsConfig');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, ApiError } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// 1. Set security HTTP headers using Helmet
app.use(helmet());

// 2. Enable Cross-Origin Resource Sharing (CORS) with settings
app.use(corsMiddleware);

// 3. Body parsers (limit to 10kb to prevent payload size attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Rate-limiting for standard API routing
app.use('/api', apiLimiter);

// 5. Register Routes
app.use('/api', healthRoutes); // GET /api/health
app.use('/api/auth', authRoutes); // GET/POST /api/auth/*
app.use('/api/user', userRoutes); // GET/PUT /api/user/*

// 6. Handle unresolved route endpoints (404 Resource Not Found)
app.use((req, res, next) => {
  next(new ApiError(`Resource not found: ${req.method} ${req.originalUrl}`, 404));
});

// 7. Global central Error handling middleware
app.use(errorHandler);

module.exports = app;
