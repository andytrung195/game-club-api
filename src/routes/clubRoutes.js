const express = require('express');
const router = express.Router();
const { getAllClubs, createClub } = require('../controllers/clubController');
const { validateClubCreation, validateSearchParams } = require('../middleware/validationMiddleware');

/**
 * Get all clubs
 */
router.get('/', validateSearchParams, getAllClubs);

/**
 * Create new club
 */
router.post('/', validateClubCreation, createClub);

module.exports = router;
