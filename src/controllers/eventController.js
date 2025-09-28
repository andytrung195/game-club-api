const { ClubQueries, EventQueries } = require('../services/queryService');
const logger = require('../services/loggerService');
const {
  HTTP_STATUS,
  API_MESSAGES,
  createSuccessResponse,
  createNotFoundError,
  createInternalError,
} = require('../constants/statusCodes');

// Get all events for a specific club
const getEventsByClub = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Fetching events for club', { clubId: id });

    // Check if club exists first
    const clubExists = await ClubQueries.clubExists(id);

    if (!clubExists) {
      logger.warn('Club not found when fetching events', { clubId: id });
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(createNotFoundError('Club', id));
    }

    const events = await EventQueries.getEventsByClub(id);

    logger.info('Successfully fetched events for club', {
      clubId: id,
      count: events.length,
    });

    res.status(HTTP_STATUS.OK).json(createSuccessResponse(events));
  } catch (error) {
    logger.error('Error in getEventsByClub', {
      error: error.message,
      stack: error.stack,
      clubId: req.params.id,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createInternalError('Error fetching events', error));
  }
};

// Create new event for a club
const createEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date } = req.body;

    logger.info('Creating new event for club', {
      clubId: id,
      title: title?.substring(0, 50),
      description: description?.substring(0, 100),
      eventDate: event_date,
    });

    // Validation is now handled by middleware

    // Check if club exists
    const clubExists = await ClubQueries.clubExists(id);

    if (!clubExists) {
      logger.warn('Club not found when creating event', { clubId: id });
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(createNotFoundError('Club', id));
    }

    const newEvent = await EventQueries.createEvent({
      club_id: id,
      title: title,
      description: description,
      event_date: event_date,
    });

    logger.info('Event created successfully', {
      id: newEvent.id,
      clubId: id,
      title: newEvent.title,
    });

    logger.businessLogic('create', 'event', {
      id: newEvent.id,
      clubId: id,
      title: newEvent.title,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json(createSuccessResponse(newEvent, API_MESSAGES.EVENT_CREATED));
  } catch (error) {
    logger.error('Error in createEvent', {
      error: error.message,
      stack: error.stack,
      clubId: req.params.id,
      title: req.body?.title,
    });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(createInternalError('Error creating event', error));
  }
};

module.exports = {
  getEventsByClub,
  createEvent,
};
