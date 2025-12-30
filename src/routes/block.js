const express = require('express');
const router = express.Router();
const { blockUser, unblockUser, getBlockedUsers } = require('../controllers/blockController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getBlockedUsers);
router.post('/:blockedUserId', authMiddleware, blockUser);
router.delete('/:blockedUserId', authMiddleware, unblockUser);

module.exports = router;