const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markAsRead, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.get('/:matchId', authMiddleware, getMessages);
router.post('/:matchId', authMiddleware, sendMessage);
router.put('/:messageId/read', authMiddleware, markAsRead);
router.delete('/:messageId', authMiddleware, deleteMessage);

module.exports = router;