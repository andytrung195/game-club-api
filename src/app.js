const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/sequelize');
const { swaggerUi, specs } = require('./config/swagger');
const logger = require('./services/loggerService');
const { requestLogger, errorLogger } = require('./middleware/loggingMiddleware');
const { HTTP_STATUS, API_MESSAGES, createSuccessResponse, createInternalError } = require('./constants/statusCodes');

// Import routes
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Request logging middleware
app.use(requestLogger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Game Club API Documentation'
}));

// Routes
app.use('/clubs', clubRoutes);
app.use('/clubs', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(
    { timestamp: new Date().toISOString() },
    'Game Club API is running'
  ));
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(
    {
      version: '1.0.0',
      documentation: '/api-docs',
      endpoints: {
        clubs: '/clubs',
        events: '/clubs/:id/events',
        health: '/api/health',
      }
    },
    'Welcome to Game Club API'
  ));
});

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  logger.error('Error handling middleware triggered', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url
  });
  
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(createInternalError(API_MESSAGES.INTERNAL_ERROR, err));
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress
  });
  
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Not Found',
    message: API_MESSAGES.ROUTE_NOT_FOUND,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

module.exports = { app, startServer };
