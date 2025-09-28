const express = require('express');
const router = express.Router();
const {
  getEventsByClub,
  createEvent,
} = require('../controllers/eventController');
const {
  validateEventCreation,
  validateClubId,
} = require('../middleware/validationMiddleware');

/**
 * Get all events for a specific club
 */
router.get('/:id/events', validateClubId, getEventsByClub);

/**
 * Create a new event for a specific club
 */
router.post('/:id/events', validateClubId, validateEventCreation, createEvent);

module.exports = router;
