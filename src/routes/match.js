const express = require('express');
const router = express.Router();
const { getMatches, getMatch } = require('../controllers/matchController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getMatches);
router.get('/:matchId', authMiddleware, getMatch);

module.exports = router;