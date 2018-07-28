const ActionEnum = require('../enums/ActionEnum');

module.exports = class SessionModel{
    constructor({ session, request }) {
        this.currentAction = ActionEnum.Default;
        this.session_id = session.session_id;
        this.requests = [request];
        this.lastCreateDocument = null;
        this.userName = '';
    }

    getFullName({ forming }){
        return this.userName;
    }
};