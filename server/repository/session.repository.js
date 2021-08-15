let sessions = {};

module.exports.getSession = (userId) => sessions[userId];

module.exports.saveSession = (userId, sessionId) =>
  (sessions[userId] = sessionId);

module.exports.getAll = () => sessions;

module.exports.removeSession = (userId) => {
  delete sessions[userId];
};
