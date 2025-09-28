const { ClubQueries } = require('../services/queryService');
const logger = require('../services/loggerService');
const {
  HTTP_STATUS,
  API_MESSAGES,
  createSuccessResponse,
  createValidationError,
  createConflictError,
  createInternalError,
} = require('../constants/statusCodes');

// Get all clubs with optional search functionality
const getAllClubs = async (req, res) => {
  try {
    const { search } = req.query;
    logger.info('Fetching clubs', { search: search || 'all' });

    const clubs = await ClubQueries.getAllClubs(search);

    logger.info('Successfully fetched clubs', {
      count: clubs.length,
      search: search || 'all',
    });

    res.status(HTTP_STATUS.OK).json(createSuccessResponse(clubs));
  } catch (error) {
    logger.error('Error in getAllClubs', {
      error: error.message,
      stack: error.stack,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createInternalError('Error fetching clubs', error));
  }
};

// Create new club
const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    logger.info('Creating new club', {
      name: name?.substring(0, 50),
      description: description?.substring(0, 100),
    });

    // Validation is now handled by middleware

    // Check if club name already exists (unique constraint)
    const existingClub = await ClubQueries.findClubByName(name);

    if (existingClub) {
      logger.warn('Club creation failed - name already exists', {
        name: name,
        existingId: existingClub.id,
      });
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json(createConflictError(API_MESSAGES.CLUB_NAME_EXISTS));
    }

    const newClub = await ClubQueries.createClub({ name, description });

    logger.info('Club created successfully', {
      id: newClub.id,
      name: newClub.name,
    });

    logger.businessLogic('create', 'club', {
      id: newClub.id,
      name: newClub.name,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json(createSuccessResponse(newClub, API_MESSAGES.CLUB_CREATED));
  } catch (error) {
    logger.error('Error in createClub', {
      error: error.message,
      stack: error.stack,
      name: req.body?.name,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createInternalError('Error creating club', error));
  }
};

module.exports = {
  getAllClubs,
  createClub,
};
