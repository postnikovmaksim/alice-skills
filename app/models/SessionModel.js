const StepsEnum = require('../enums/StepsEnum');

module.exports = class SessionModel{
    constructor({session, response}){
        return {
            curentStep: StepsEnum.Default,
            session_id: session.session,
            response: response
        }
    }
};