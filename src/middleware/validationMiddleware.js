const logger = require('../services/loggerService');
const {
  HTTP_STATUS,
  createValidationError,
} = require('../constants/statusCodes');

/**
 * Validation middleware for club creation
 */
const validateClubCreation = (req, res, next) => {
  try {
    const { name, description } = req.body;

    logger.validation('club_creation', 'Starting validation', {
      name: name?.substring(0, 50),
      description: description?.substring(0, 100),
    });

    // Validate required fields
    if (!name || !name.trim()) {
      logger.validation('name', name, 'Club name is required');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(createValidationError('name', 'Club name is required'));
    }

    if (!description || !description.trim()) {
      logger.validation(
        'description',
        description,
        'Club description is required'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError('description', 'Club description is required')
        );
    }

    // Validate name length
    if (name.trim().length > 100) {
      logger.validation(
        'name',
        name,
        'Club name must be 100 characters or less'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'name',
            'Club name must be 100 characters or less'
          )
        );
    }

    // Validate name format (no special characters that might cause issues)
    const nameRegex = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
    if (!nameRegex.test(name.trim())) {
      logger.validation('name', name, 'Club name contains invalid characters');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'name',
            'Club name contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed'
          )
        );
    }

    // Validate description length
    if (description.trim().length > 1000) {
      logger.validation(
        'description',
        description,
        'Club description must be 1000 characters or less'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'description',
            'Club description must be 1000 characters or less'
          )
        );
    }

    // Sanitize input (trim whitespace)
    req.body.name = name.trim();
    req.body.description = description.trim();

    logger.validation('club_creation', 'Validation passed', {
      name: req.body.name,
      description: req.body.description,
    });

    next();
  } catch (error) {
    logger.error('Error in validateClubCreation middleware', {
      error: error.message,
      stack: error.stack,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createValidationError('validation', 'Internal validation error'));
  }
};

/**
 * Validation middleware for event creation
 */
const validateEventCreation = (req, res, next) => {
  try {
    const { title, description, event_date } = req.body;

    logger.validation('event_creation', 'Starting validation', {
      title: title?.substring(0, 50),
      description: description?.substring(0, 100),
      eventDate: event_date,
    });

    // Validate required fields
    if (!title || !title.trim()) {
      logger.validation('title', title, 'Event title is required');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(createValidationError('title', 'Event title is required'));
    }

    if (!description || !description.trim()) {
      logger.validation(
        'description',
        description,
        'Event description is required'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError('description', 'Event description is required')
        );
    }

    if (!event_date) {
      logger.validation('event_date', event_date, 'Event date is required');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(createValidationError('event_date', 'Event date is required'));
    }

    // Validate title length
    if (title.trim().length > 100) {
      logger.validation(
        'title',
        title,
        'Event title must be 100 characters or less'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'title',
            'Event title must be 100 characters or less'
          )
        );
    }

    // Validate title format
    const titleRegex = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
    if (!titleRegex.test(title.trim())) {
      logger.validation(
        'title',
        title,
        'Event title contains invalid characters'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'title',
            'Event title contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed'
          )
        );
    }

    // Validate description length
    if (description.trim().length > 1000) {
      logger.validation(
        'description',
        description,
        'Event description must be 1000 characters or less'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'description',
            'Event description must be 1000 characters or less'
          )
        );
    }

    // Validate date format
    const eventDate = new Date(event_date);
    if (isNaN(eventDate.getTime())) {
      logger.validation('event_date', event_date, 'Invalid event date format');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'event_date',
            'Invalid event date format. Please use ISO 8601 format (e.g., 2024-12-31T18:00:00Z)'
          )
        );
    }

    // Validate that event date is not in the past (optional business rule)
    const now = new Date();
    if (eventDate < now) {
      logger.validation(
        'event_date',
        event_date,
        'Event date cannot be in the past'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'event_date',
            'Event date cannot be in the past'
          )
        );
    }

    // Validate that event date is not too far in the future (optional business rule)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2); // 2 years from now
    if (eventDate > maxFutureDate) {
      logger.validation(
        'event_date',
        event_date,
        'Event date cannot be more than 2 years in the future'
      );
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError(
            'event_date',
            'Event date cannot be more than 2 years in the future'
          )
        );
    }

    // Sanitize input (trim whitespace)
    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.event_date = event_date; // Keep original format for database

    logger.validation('event_creation', 'Validation passed', {
      title: req.body.title,
      description: req.body.description,
      eventDate: req.body.event_date,
    });

    next();
  } catch (error) {
    logger.error('Error in validateEventCreation middleware', {
      error: error.message,
      stack: error.stack,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createValidationError('validation', 'Internal validation error'));
  }
};

/**
 * Validation middleware for club ID parameter
 */
const validateClubId = (req, res, next) => {
  try {
    const { id } = req.params;
    
    logger.validation('club_id', 'Validating club ID', { clubId: id });

    // Check if ID is provided
    if (!id) {
      logger.validation('club_id', id, 'Club ID is required');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(createValidationError('id', 'Club ID is required'));
    }

    // Check if ID is a valid number
    const clubId = parseInt(id, 10);
    if (isNaN(clubId) || clubId <= 0) {
      logger.validation('club_id', id, 'Club ID must be a positive integer');
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          createValidationError('id', 'Club ID must be a positive integer')
        );
    }

    // Add validated ID to request object
    req.params.id = clubId.toString();

    logger.validation('club_id', 'Validation passed', {
      clubId: req.params.id,
    });

    next();
  } catch (error) {
    logger.error('Error in validateClubId middleware', {
      error: error.message,
      stack: error.stack,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createValidationError('validation', 'Internal validation error'));
  }
};

/**
 * Validation middleware for search parameters
 */
const validateSearchParams = (req, res, next) => {
  try {
    const { search } = req.query;

    logger.validation('search_params', 'Validating search parameters', {
      search,
    });

    // If search parameter is provided, validate it
    if (search !== undefined) {
      // Check if search is a string
      if (typeof search !== 'string') {
        logger.validation(
          'search',
          search,
          'Search parameter must be a string'
        );
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            createValidationError('search', 'Search parameter must be a string')
          );
      }

      // Check search length
      if (search.length > 100) {
        logger.validation(
          'search',
          search,
          'Search term must be 100 characters or less'
        );
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            createValidationError(
              'search',
              'Search term must be 100 characters or less'
            )
          );
      }

      // Check for potentially harmful characters
      const searchRegex = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
      if (!searchRegex.test(search)) {
        logger.validation(
          'search',
          search,
          'Search term contains invalid characters'
        );
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            createValidationError(
              'search',
              'Search term contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed'
            )
          );
      }

      // Sanitize search term
      req.query.search = search.trim();
    }

    logger.validation('search_params', 'Validation passed', {
      search: req.query.search,
    });

    next();
  } catch (error) {
    logger.error('Error in validateSearchParams middleware', {
      error: error.message,
      stack: error.stack,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createValidationError('validation', 'Internal validation error'));
  }
};

module.exports = {
  validateClubCreation,
  validateEventCreation,
  validateClubId,
  validateSearchParams,
};
