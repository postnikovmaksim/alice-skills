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
    return Promise.resolve({ text: `Здравствуйте, ${userName}, что Вы хотели?` });
}

async function createBillAction({ sessionContext }) {
    const command = sessionContext.requests[sessionContext.requests.length - 1].command;

    const kontragentName = await identifyService.identifyKontragent({ command }).catch(e => e);
    if (!kontragentName) Promise.resolve({ text: 'К сожалению не удалосьпонять имя контрагента, попробуйте еще раз' });

    const kontragents = await kontragentService.getKontragent({ name: kontragentName }).catch(e => e);
    if (kontragents.length === 0) Promise.resolve({ text: 'Контрагент с таким именем не найден, попробуйте еще раз' });
    if (kontragents.length > 1) Promise.resolve({ text: 'К сожалению не полуться создать счет, так как контрагентов с таким именем больше одного. Могу ли я чем-то еще помочь?' });

    const productName = await identifyService.identifyProduct({ command }).catch(e => e);
    if (!productName) Promise.resolve({ text: 'Не удалось определить название товара, попробуйте еще раз' });
    const products = await productService.getProduct({ name: productName }).catch(e => e);
    if (products.length === 0) Promise.resolve({ text: 'Товар с таким названием не найден, попробуйте еще раз' });
    if (products.length > 1) Promise.resolve({ text: 'К сожалению не полуться создать счет, так как товаров с таким названием больше одного. Могу ли я чем-то еще помочь?' });

    await billService.create({kontragent: kontragents[0], products:[products[0]]});
    return Promise.resolve({ text: 'Счет создан, что-то еще?' });
}

function closeSkillsAction() {
    return Promise.resolve({ text: 'Приятно было пообщаться.', end_session: true });
}

function notUnderstandAction() {
    return Promise.resolve({ text: 'К сожалению, я Вас не поняла. Повторите пожайлуста.' });
}