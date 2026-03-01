const mongoose = require('mongoose');

const multiplayerRoomSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  players: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hasJoined: { type: Boolean, default: false },
    solvedCount: { type: Number, default: 0 },
    wantsToSkip: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    timeTakenTotal: { type: Number, default: 0 } // in milliseconds
  }],
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' }],
  currentProblemIndex: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 30 }, // in minutes
  status: { type: String, enum: ['Waiting', 'Active', 'Ended'], default: 'Waiting' },
  startedAt: { type: Date },
  endedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('MultiplayerRoom', multiplayerRoomSchema);
