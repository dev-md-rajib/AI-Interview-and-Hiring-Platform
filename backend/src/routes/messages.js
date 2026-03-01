const express = require('express');
const router = express.Router();
const { getOrCreateConversation, getMyConversations, getMessages, sendMessage, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/conversation', protect, getOrCreateConversation);
router.get('/conversations', protect, getMyConversations);
router.get('/unread', protect, getUnreadCount);
router.get('/:conversationId', protect, getMessages);
router.post('/:conversationId', protect, sendMessage);

module.exports = router;
