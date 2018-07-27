const ActionEnum = require('./enums/ActionEnum');
const userService = require('./services/userService');
const kontragentService = require('./services/kontragentService');
const productService = require('./services/productService');

module.exports = {
    rout({ sessionContext }){
        switch (sessionContext.currentAction){
            case ActionEnum.Default: {
                return defaultStep();
            }
            case ActionEnum.CreateBill: {
                return createBillStep();
            }
            default:
                return notUnderstandStep();
        }
    }
};

async function defaultStep() {
    const userName = await userService.getUserName();
    return Promise.resolve(`Здравствуйте, ${userName}, что вы хотели?`);
}

async function createBillStep() {
    kontragentService.getKontragent();
    productService.getProduct();
    return Promise.resolve(`Счет создан, что-то еще?`);
}

function notUnderstandStep() {
    return Promise.resolve(`К сожалению, я вас не поняла. Повторите пожайлуста.`);
}