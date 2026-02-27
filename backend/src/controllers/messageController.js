const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Application = require('../models/Application');

// Check if messaging is allowed between two users
const canMessage = async (senderId, receiverId) => {
  // Check if there's an active application between them
  const application = await Application.findOne({
    $or: [
      { candidate: senderId },
      { candidate: receiverId },
    ],
  }).populate('job');

  if (application) return true;
  return false; // fallback — will be overridden if recruiter initiates
};

// @desc    Get or create conversation
// @route   POST /api/messages/conversation
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) return res.status(400).json({ success: false, message: 'recipientId required' });

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    }).populate('participants', 'name email profileImage role');

    if (!conversation) {
      // Recruiters can always initiate
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
      });
      await conversation.populate('participants', 'name email profileImage role');
    }

    res.status(200).json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my conversations
// @route   GET /api/messages/conversations
// @access  Private
const getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name email profileImage role')
      .sort({ lastMessageAt: -1 });
    res.status(200).json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    // Must be a participant
    if (!conversation.participants.map((p) => p.toString()).includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message
// @route   POST /api/messages/:conversationId
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    if (!conversation.participants.map((p) => p.toString()).includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { content, fileUrl, fileType } = req.body;
    if (!content && !fileUrl) return res.status(400).json({ success: false, message: 'Message content required' });

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content: content || '',
      fileUrl: fileUrl || '',
      fileType: fileType || '',
    });

    // Update conversation
    conversation.lastMessage = content || 'Shared a file';
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await message.populate('sender', 'name profileImage');
    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrCreateConversation, getMyConversations, getMessages, sendMessage };
