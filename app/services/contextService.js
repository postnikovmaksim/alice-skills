const SessionModel = require('../models/SessionModel');

const activeSessions = [];

module.exports = {
  get({ session, response }){
    const currentSession = activeSessions.find(s => s.session_id === session.session_id);
    if(!currentSession){
        return new SessionModel({session, response});
    }

    return currentSession;
  }
};