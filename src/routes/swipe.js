const express = require('express');
const router = express.Router();
const { discover, swipe } = require('../controllers/swipeController');
const authMiddleware = require('../middleware/auth');

router.get('/discover', authMiddleware, discover);
router.post('/', authMiddleware, swipe);

module.exports = router;