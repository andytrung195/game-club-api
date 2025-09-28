const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../services/loggerService');

// Database file path
const dbPath = path.join(__dirname, '../../data/game_club.db');

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: (msg) => logger.debug('Sequelize Query:', { query: msg }),
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Sequelize database connection established successfully', { path: dbPath });
    return true;
  } catch (error) {
    logger.error('Unable to connect to Sequelize database', { 
      error: error.message, 
      path: dbPath 
    });
    return false;
  }
};

// Initialize database (create tables)
const initializeDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ force: false }); // Don't force recreate tables
    logger.info('Sequelize database synchronized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Sequelize database', { 
      error: error.message, 
      stack: error.stack 
    });
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
};
