let sessions = {};

module.exports.getSession = (userId) => sessions[userId];

module.exports.saveSession = (userId, sessionId) =>
  (sessions[userId] = sessionId);