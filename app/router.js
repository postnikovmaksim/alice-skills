const StepsEnum = require('./enums/StepsEnum');
const userService = require('./services/userService');

module.exports = {
    rout({ sessionContext, createResponse = () => {} }){
        switch (sessionContext.curentStep){
            case StepsEnum.Default: {
                return defaultStep();
            }
        }
    }
};

async function defaultStep() {
    const userName = await userService.getUserName();
    return Promise.resolve(`Здравствуйте, ${userName}, что вы хотели?`);
}