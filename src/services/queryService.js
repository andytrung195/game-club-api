const { Club, Event } = require('../models');
const { Op } = require('sequelize');
const logger = require('./loggerService');

/**
 * Club-related database queries
 */
class ClubQueries {
  /**
   * Get all clubs with optional search
   * @param {string} searchTerm - Optional search term
   * @returns {Promise<Array>} Array of clubs
   */
  static async getAllClubs(searchTerm = null) {
    logger.database('SELECT', 'clubs', { search: searchTerm || 'all' });

    let whereClause = {};
    
    if (searchTerm) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    const clubs = await Club.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'description'],
    });

    logger.database('SELECT_RESULT', 'clubs', { count: clubs.length });
    return clubs;
  }

  /**
   * Get club by ID
   * @param {number} clubId - Club ID
   * @returns {Promise<Object|null>} Club object or null
   */
  static async getClubById(clubId) {
    logger.database('SELECT', 'clubs', { operation: 'get_by_id', id: clubId });

    const club = await Club.findByPk(clubId, {
      attributes: ['id', 'name', 'description'],
    });

    logger.database('SELECT_RESULT', 'clubs', { found: !!club, id: clubId });
    return club;
  }

  /**
   * Check if club exists by ID
   * @param {number} clubId - Club ID
   * @returns {Promise<boolean>} True if club exists
   */
  static async clubExists(clubId) {
    logger.database('SELECT', 'clubs', { operation: 'check_exists', id: clubId });

    const club = await Club.findByPk(clubId, {
      attributes: ['id'],
    });

    const exists = !!club;
    logger.database('SELECT_RESULT', 'clubs', { exists, id: clubId });
    return exists;
  }

  /**
   * Check if club name already exists
   * @param {string} name - Club name
   * @returns {Promise<Object|null>} Existing club or null
   */
  static async findClubByName(name) {
    logger.database('SELECT', 'clubs', { operation: 'check_name_exists', name });

    const club = await Club.findOne({
      where: { name: name },
      attributes: ['id', 'name'],
    });

    logger.database('SELECT_RESULT', 'clubs', { found: !!club, name });
    return club;
  }

  /**
   * Create a new club
   * @param {Object} clubData - Club data
   * @param {string} clubData.name - Club name
   * @param {string} clubData.description - Club description
   * @returns {Promise<Object>} Created club
   */
  static async createClub(clubData) {
    logger.database('INSERT', 'clubs', { 
      name: clubData.name, 
      description: clubData.description 
    });

    const newClub = await Club.create({
      name: clubData.name,
      description: clubData.description,
    });

    logger.database('INSERT_RESULT', 'clubs', { 
      id: newClub.id, 
      name: newClub.name 
    });
    return newClub;
  }

  /**
   * Update club by ID
   * @param {number} clubId - Club ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object|null>} Updated club or null
   */
  static async updateClub(clubId, updateData) {
    logger.database('UPDATE', 'clubs', { id: clubId, data: updateData });

    const [affectedRows] = await Club.update(updateData, {
      where: { id: clubId },
    });

    if (affectedRows === 0) {
      logger.database('UPDATE_RESULT', 'clubs', { updated: false, id: clubId });
      return null;
    }

    const updatedClub = await Club.findByPk(clubId, {
      attributes: ['id', 'name', 'description'],
    });

    logger.database('UPDATE_RESULT', 'clubs', { 
      updated: true, 
      id: clubId, 
      name: updatedClub?.name 
    });
    return updatedClub;
  }

  /**
   * Delete club by ID
   * @param {number} clubId - Club ID
   * @returns {Promise<boolean>} True if deleted
   */
  static async deleteClub(clubId) {
    logger.database('DELETE', 'clubs', { id: clubId });

    const deletedRows = await Club.destroy({
      where: { id: clubId },
    });

    const deleted = deletedRows > 0;
    logger.database('DELETE_RESULT', 'clubs', { deleted, id: clubId });
    return deleted;
  }
}

/**
 * Event-related database queries
 */
class EventQueries {
  /**
   * Get all events for a specific club
   * @param {number} clubId - Club ID
   * @returns {Promise<Array>} Array of events
   */
  static async getEventsByClub(clubId) {
    logger.database('SELECT', 'events', { clubId });

    const events = await Event.findAll({
      where: { club_id: clubId },
      order: [['event_date', 'ASC']],
      attributes: ['id', 'title', 'description', 'event_date'],
    });

    logger.database('SELECT_RESULT', 'events', { 
      count: events.length, 
      clubId 
    });
    return events;
  }

  /**
   * Get event by ID
   * @param {number} eventId - Event ID
   * @returns {Promise<Object|null>} Event object or null
   */
  static async getEventById(eventId) {
    logger.database('SELECT', 'events', { operation: 'get_by_id', id: eventId });

    const event = await Event.findByPk(eventId, {
      attributes: ['id', 'title', 'description', 'event_date', 'club_id'],
    });

    logger.database('SELECT_RESULT', 'events', { found: !!event, id: eventId });
    return event;
  }

  /**
   * Check if event exists by ID
   * @param {number} eventId - Event ID
   * @returns {Promise<boolean>} True if event exists
   */
  static async eventExists(eventId) {
    logger.database('SELECT', 'events', { operation: 'check_exists', id: eventId });

    const event = await Event.findByPk(eventId, {
      attributes: ['id'],
    });

    const exists = !!event;
    logger.database('SELECT_RESULT', 'events', { exists, id: eventId });
    return exists;
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @param {number} eventData.club_id - Club ID
   * @param {string} eventData.title - Event title
   * @param {string} eventData.description - Event description
   * @param {string} eventData.event_date - Event date
   * @returns {Promise<Object>} Created event
   */
  static async createEvent(eventData) {
    logger.database('INSERT', 'events', { 
      clubId: eventData.club_id,
      title: eventData.title,
      description: eventData.description,
      eventDate: eventData.event_date
    });

    const newEvent = await Event.create({
      club_id: eventData.club_id,
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.event_date,
    });

    logger.database('INSERT_RESULT', 'events', { 
      id: newEvent.id, 
      clubId: eventData.club_id,
      title: newEvent.title 
    });
    return newEvent;
  }

  /**
   * Update event by ID
   * @param {number} eventId - Event ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object|null>} Updated event or null
   */
  static async updateEvent(eventId, updateData) {
    logger.database('UPDATE', 'events', { id: eventId, data: updateData });

    const [affectedRows] = await Event.update(updateData, {
      where: { id: eventId },
    });

    if (affectedRows === 0) {
      logger.database('UPDATE_RESULT', 'events', { updated: false, id: eventId });
      return null;
    }

    const updatedEvent = await Event.findByPk(eventId, {
      attributes: ['id', 'title', 'description', 'event_date', 'club_id'],
    });

    logger.database('UPDATE_RESULT', 'events', { 
      updated: true, 
      id: eventId, 
      title: updatedEvent?.title 
    });
    return updatedEvent;
  }

  /**
   * Delete event by ID
   * @param {number} eventId - Event ID
   * @returns {Promise<boolean>} True if deleted
   */
  static async deleteEvent(eventId) {
    logger.database('DELETE', 'events', { id: eventId });

    const deletedRows = await Event.destroy({
      where: { id: eventId },
    });

    const deleted = deletedRows > 0;
    logger.database('DELETE_RESULT', 'events', { deleted, id: eventId });
    return deleted;
  }

  /**
   * Get events by club with pagination
   * @param {number} clubId - Club ID
   * @param {Object} options - Pagination options
   * @param {number} options.limit - Number of events to return
   * @param {number} options.offset - Number of events to skip
   * @returns {Promise<Object>} Events with pagination info
   */
  static async getEventsByClubPaginated(clubId, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    logger.database('SELECT', 'events', { 
      clubId, 
      pagination: { limit, offset } 
    });

    const { count, rows: events } = await Event.findAndCountAll({
      where: { club_id: clubId },
      order: [['event_date', 'ASC']],
      attributes: ['id', 'title', 'description', 'event_date'],
      limit,
      offset,
    });

    logger.database('SELECT_RESULT', 'events', { 
      count: events.length, 
      total: count,
      clubId 
    });

    return {
      events,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + events.length < count,
      },
    };
  }

  /**
   * Get upcoming events for a club
   * @param {number} clubId - Club ID
   * @param {number} days - Number of days ahead to look
   * @returns {Promise<Array>} Array of upcoming events
   */
  static async getUpcomingEvents(clubId, days = 30) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    logger.database('SELECT', 'events', { 
      clubId, 
      operation: 'upcoming',
      days,
      dateRange: { from: now, to: futureDate }
    });

    const events = await Event.findAll({
      where: {
        club_id: clubId,
        event_date: {
          [Op.between]: [now, futureDate],
        },
      },
      order: [['event_date', 'ASC']],
      attributes: ['id', 'title', 'description', 'event_date'],
    });

    logger.database('SELECT_RESULT', 'events', { 
      count: events.length, 
      clubId,
      days 
    });
    return events;
  }
}

module.exports = {
  ClubQueries,
  EventQueries,
};
