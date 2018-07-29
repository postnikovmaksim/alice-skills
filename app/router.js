const ActionEnum = require('./enums/ActionEnum');
const userService = require('./services/userService');
const kontragentService = require('./services/kontragentService');
const productService = require('./services/productService');
const billService = require('./services/billService');
const identifyService = require('./services/identifyService');
const emailService = require('./services/emailService');

module.exports = {
    rout({ sessionContext }){
        switch (sessionContext.currentAction){
            case ActionEnum.Default: {
                return defaultAction({ sessionContext });
            }
            case ActionEnum.CreateBill: {
                return createBillAction({ sessionContext });
            }
            case ActionEnum.SendEmail: {
                return createSendEmail({ sessionContext });
            }
            case ActionEnum.CloseSkills:{
                return closeSkillsAction();
            }
            default:
                return notUnderstandAction();
        }
    }
};

async function defaultAction({ sessionContext }) {
    sessionContext.userName = await userService.getUserName();
    return Promise.resolve({
        text: `Здравствуйте, ${sessionContext.userName}. Что Вы хотели?`
        tts: `Здравствуйте - ${sessionContext.userName}. - - Что Вы хотели?`,
    });
}

async function createBillAction({ sessionContext }) {
    const command = sessionContext.requests[sessionContext.requests.length - 1].command;

    const kontragentName = await identifyService.identifyKontragent({ command }).catch(e => e);
    if (!kontragentName) return Promise.resolve({ text: 'К сожалению не удалось понять имя контрагента, попробуйте еще раз' });

    const kontragents = await kontragentService.getKontragent({ fullName: kontragentName }).catch(e => e);
    if (kontragents.length === 0) return Promise.resolve({ text: 'Контрагент с таким именем не найден, попробуйте еще раз' });
    if (kontragents.length > 1) return Promise.resolve({ text: 'К сожалению не полуться создать счет, так как контрагентов с таким именем больше одного. Могу ли я чем-то еще помочь?' });

    const productName = await identifyService.identifyProduct({ command }).catch(e => e);
    if (!productName) return Promise.resolve({ text: 'Не удалось определить название товара, попробуйте еще раз' });

    const products = await productService.getProduct({ name: productName }).catch(e => e);
    if (products.length === 0) return Promise.resolve({ text: 'Товар с таким названием не найден, попробуйте еще раз' });
    if (products.length > 1) return Promise.resolve({ text: 'К сожалению не полуться создать счет, так как товаров с таким названием больше одного. Могу ли я чем-то еще помочь?' });

    const bill = await billService.create({kontragent: kontragents[0], products:[products[0]]});
    sessionContext.lastCreateDocument.push(bill);
    return Promise.resolve({ text: 'Счет создан, что-то еще?' });
}

async function createSendEmail({ sessionContext }) {
    await emailService.send({ sessionContext });
    return Promise.resolve({ text: 'Отправила, еще что-то?' });
}

function closeSkillsAction() {
    return Promise.resolve({ text: 'Приятно было пообщаться.', end_session: true });
}

function notUnderstandAction() {
    return Promise.resolve({ text: 'К сожалению, я Вас не поняла. Повторите пожайлуста.' });
}
