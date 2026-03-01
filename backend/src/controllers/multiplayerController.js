const MultiplayerRoom = require('../models/MultiplayerRoom');
const QuestionBank = require('../models/QuestionBank');
const User = require('../models/User');
const { runAllTestCases, runCode } = require('../services/codeRunner');

exports.createRoom = async (req, res) => {
  try {
    const { numProblems, timeLimit, invitedEmails } = req.body;
    
    // Find invited users by email
    let invitedUserIds = [];
    if (invitedEmails && invitedEmails.length > 0) {
      const users = await User.find({ email: { $in: invitedEmails }, role: 'CANDIDATE' });
      invitedUserIds = users.map(u => u._id);
    }

    // Get random coding problems
    const allCodingProblems = await QuestionBank.find({ type: 'coding' });
    if (allCodingProblems.length < numProblems) {
      return res.status(400).json({ message: `Only ${allCodingProblems.length} coding questions available.` });
    }
    
    // Shuffle and pick
    const shuffled = allCodingProblems.sort(() => 0.5 - Math.random());
    const selectedProblems = shuffled.slice(0, numProblems).map(p => p._id);

    const room = await MultiplayerRoom.create({
      creator: req.user.id,
      invitedUsers: invitedUserIds,
      problems: selectedProblems,
      timeLimit: timeLimit || 30,
      players: [{
        user: req.user.id,
        hasJoined: true, // Creator auto-joins
        isActive: true
      }]
    });

    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find rooms where user is creator OR invited OR inside players array
    const rooms = await MultiplayerRoom.find({
      $or: [
        { creator: userId },
        { invitedUsers: userId },
        { 'players.user': userId }
      ]
    })
    .populate('creator', 'name email profilePic')
    .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await MultiplayerRoom.findById(req.params.id)
      .populate('creator', 'name email profilePic')
      .populate('invitedUsers', 'name email profilePic')
      .populate('players.user', 'name email profilePic');
      
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Populate the current question, but hide test case expected outputs from candidates
    let currentProblem = null;
    if (room.currentProblemIndex < room.problems.length) {
      const q = await QuestionBank.findById(room.problems[room.currentProblemIndex]).lean();
      if (q) {
        if (q.testCases) {
          q.testCases = q.testCases.map((tc, index) => ({
            input: tc.hidden ? '(hidden)' : tc.input,
            expectedOutput: tc.hidden ? '(hidden)' : tc.expectedOutput,
            hidden: tc.hidden
          }));
        }
        currentProblem = q;
      }
    }

    res.json({ success: true, room, currentProblem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const room = await MultiplayerRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    
    if (room.status === 'Ended') return res.status(400).json({ message: 'Room has already ended' });

    const userId = req.user.id;
    
    // Check if in players array
    const playerIndex = room.players.findIndex(p => p.user.toString() === userId);
    
    if (playerIndex > -1) {
      // Already a player, just mark as joined/active
      room.players[playerIndex].hasJoined = true;
      room.players[playerIndex].isActive = true;
    } else {
      // Check if invited
      const isInvited = room.invitedUsers.some(u => u.toString() === userId);
      // Wait, let's allow anyone with the link to join if we want, or restrict to invited
      // For now, restrict to invited or creator
      if (!isInvited && room.creator.toString() !== userId) {
        return res.status(403).json({ message: 'You are not invited to this room' });
      }
      
      // Move from invited to players
      room.invitedUsers = room.invitedUsers.filter(u => u.toString() !== userId);
      room.players.push({
        user: userId,
        hasJoined: true,
        isActive: true
      });
    }

    // If waiting and more than 1 person joined, or even 1 person (the creator), 
    // we actually start the room immediately when the creator goes to it, or when someone joins.
    if (room.status === 'Waiting') {
      room.status = 'Active';
      room.startedAt = new Date();
    }

    await room.save();
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const room = await MultiplayerRoom.findById(req.params.id);
    if (!room || room.status !== 'Active') return res.status(400).json({ message: 'Invalid or inactive room' });

    const currentProblem = await QuestionBank.findById(room.problems[room.currentProblemIndex]);
    if (!currentProblem || currentProblem.type !== 'coding') {
      return res.status(404).json({ message: 'Problem not found or not a coding problem' });
    }

    const { results, allPassed } = runAllTestCases(code, language, currentProblem.testCases || []);
    res.json({ success: true, results, allPassed });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error executing code' });
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const room = await MultiplayerRoom.findById(req.params.id);
    if (!room || room.status !== 'Active') return res.status(400).json({ message: 'Invalid or inactive room' });

    const currentProblem = await QuestionBank.findById(room.problems[room.currentProblemIndex]);
    if (!currentProblem) return res.status(404).json({ message: 'Problem not found' });

    const { results, allPassed } = runAllTestCases(code, language, currentProblem.testCases || []);

    if (allPassed) {
      const playerIndex = room.players.findIndex(p => p.user.toString() === req.user.id);
      if (playerIndex > -1) {
        room.players[playerIndex].solvedCount += 1;
        // Optionally add execution time or generic time taken
        // for simplicity, let's just add 1 sec per problem solved or actual Date.now() - startedAt delta
        const timeTakenMs = Date.now() - new Date(room.startedAt).getTime();
        room.players[playerIndex].timeTakenTotal = timeTakenMs;
        
        // Reset skips
        room.players.forEach(p => p.wantsToSkip = false);
        
        // Advance room
        room.currentProblemIndex += 1;
        if (room.currentProblemIndex >= room.problems.length) {
          room.status = 'Ended';
          room.endedAt = new Date();
        }
        await room.save();
      }
    }

    res.json({ success: true, results, allPassed, room });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error submitting code' });
  }
};

exports.skipProblem = async (req, res) => {
  try {
    const room = await MultiplayerRoom.findById(req.params.id);
    if (!room || room.status !== 'Active') return res.status(400).json({ message: 'Invalid or inactive room' });

    const playerIndex = room.players.findIndex(p => p.user.toString() === req.user.id);
    if (playerIndex === -1) return res.status(403).json({ message: 'Not a player' });

    room.players[playerIndex].wantsToSkip = true;

    // Check if ALL active joined players want to skip
    const activePlayers = room.players.filter(p => p.hasJoined && p.isActive);
    const allSkip = activePlayers.length > 0 && activePlayers.every(p => p.wantsToSkip);

    if (allSkip) {
      room.players.forEach(p => p.wantsToSkip = false);
      room.currentProblemIndex += 1;
      if (room.currentProblemIndex >= room.problems.length) {
        room.status = 'Ended';
        room.endedAt = new Date();
      }
    }

    await room.save();
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const room = await MultiplayerRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const playerIndex = room.players.findIndex(p => p.user.toString() === req.user.id);
    if (playerIndex > -1) {
      room.players[playerIndex].isActive = false;
      
      // If no active players left, end the room immediately
      const activePlayers = room.players.filter(p => p.hasJoined && p.isActive);
      if (activePlayers.length === 0 && room.status === 'Active') {
        room.status = 'Ended';
        room.endedAt = new Date();
      }
      
      await room.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
