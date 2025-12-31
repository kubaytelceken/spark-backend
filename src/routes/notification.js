const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getNotifications);
router.put('/:notificationId/read', authMiddleware, markAsRead);
router.put('/read-all', authMiddleware, markAllAsRead);

module.exports = router;