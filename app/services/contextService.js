const SessionModel = require('../models/SessionModel');
const ActionEnum = require('../enums/ActionEnum');

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
    lastSession.currentAction = identifyAction({command: request.command});

    return lastSession;
  }
};

function identifyAction({ command }) {
  if (isActionCreateBill({ command })){
    return ActionEnum.CreateBill;
  }
  return ActionEnum.NotUnderstand;
}

function isActionCreateBill({ command }) {
  const commandLowerCase = command.toLowerCase();
  const keywordsBill = ['счет', 'счета'];
  const keywordsAction = ['создать', 'выставить'];

  const isBill = find(keywordsBill, commandLowerCase);
  const isCreate = find(keywordsAction, commandLowerCase);

  return isBill && isCreate;
}

function find(keywords = [], command) {
   return keywords.some(k => command.indexOf(k) !== -1);
}