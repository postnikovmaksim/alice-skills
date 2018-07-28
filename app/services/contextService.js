const SessionModel = require('../models/SessionModel');
const ActionEnum = require('../enums/ActionEnum');
const identifyService = require('../services/identifyService');

const activeSessions = [];

module.exports = {
  get({ session, request }){
    const lastSession = activeSessions.find(s => s.session_id === session.session_id);
    if(!lastSession){
      const newSession = new SessionModel({session, request});
      activeSessions.push(newSession);
      return newSession;
    }

    lastSession.requests.push(request);
    lastSession.currentAction = identifyService.identifyAction({command: request.command});

    return lastSession;
  }
};