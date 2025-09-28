const { app, startServer } = require('./src/app');
const logger = require('./src/services/loggerService');

const PORT = process.env.PORT || 3000;

// Start the server
const start = async () => {
  try {
    await startServer();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Game Club API server is running on port ${PORT}`);
      logger.info(`📱 API Base URL: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      logger.info(`📚 Documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the application
start();
