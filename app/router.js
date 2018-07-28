const ActionEnum = require('./enums/ActionEnum');
const userService = require('./services/userService');
const kontragentService = require('./services/kontragentService');
const productService = require('./services/productService');
const billService = require('./services/billService');
const identifyService = require('./services/identifyService');

module.exports = {
    rout({ sessionContext }){
        switch (sessionContext.currentAction){
            case ActionEnum.Default: {
                return defaultAction();
            }
            case ActionEnum.CreateBill: {
                return createBillAction({ sessionContext });
            }
            case ActionEnum.CloseSkills:{
                return closeSkillsAction();
            }
            default:
                return notUnderstandAction();
        }
    }
};

async function defaultAction() {
    const userName = await userService.getUserName();
    return Promise.resolve({ message: `Здравствуйте, ${userName}, что Вы хотели?` });
}

async function createBillAction({ sessionContext }) {
    const command = sessionContext.requests[sessionContext.requests.length - 1].command;

    const kontragentName = await identifyService.identifyKontragent({ command })
        .catch(() => Promise.resolve({ message: 'Не удалось определить имя контрагента, попробуйте еще раз' }));
    const kontragents = await kontragentService.getKontragent({ name: kontragentName })
        .catch(() => Promise.resolve(notUnderstandAction()));
    if (kontragents.length > 1) {
        return Promise.resolve({ message: 'К сожалению не полуться создать, так как контрагентов с таким именем больше одного. Могу ли я чем-то еще помочь?' });
    }

    const productName = await identifyService.identifyProduct({ command })
        .catch(() => Promise.resolve({ message: 'Не удалось определить название товара, попробуйте еще раз' }));
    const products = await productService.getProduct({ name: productName })
        .catch(() => Promise.resolve(notUnderstandAction()));
    if (products.length > 1) {
        return Promise.resolve({ message: 'К сожалению не полуться создать, так как товаров с таким названием больше одного. Могу ли я чем-то еще помочь?' });
    }

    await billService.create({kontragent: kontragents[0], products:[products[0]]});
    return Promise.resolve({ message: 'Счет создан, что-то еще?' });
}

function closeSkillsAction() {
    return Promise.resolve({ message: 'Приятно было пообщаться.', end_session: true });
}

function notUnderstandAction() {
    return Promise.resolve({ message: 'К сожалению, я Вас не поняла. Повторите пожайлуста.' });
}