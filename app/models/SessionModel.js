const ActionEnum = require('../enums/ActionEnum');

module.exports = class SessionModel{
    constructor({session, request}){
        return {
            currentAction: ActionEnum.Default,
            session_id: session.session_id,
            requests: [request]
        }
    }
};