const ActionEnum = require('./enums/ActionEnum');
const userService = require('./services/userService');
const kontragentService = require('./services/kontragentService');
const productService = require('./services/productService');
const billService = require('./services/billService');

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
    return Promise.resolve(`Здравствуйте, ${userName}, что Вы хотели?`);
}

async function createBillStep() {
    const kontragent = await kontragentService.getKontragent();
    const product = await productService.getProduct();
    await billService.create({kontragent, products:[product]});
    return Promise.resolve(`Счет создан, что-то еще?`);
}

function notUnderstandStep() {
    return Promise.resolve(`К сожалению, я Вас не поняла. Повторите пожайлуста.`);
}