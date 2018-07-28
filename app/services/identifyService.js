const ActionEnum = require('../enums/ActionEnum');

module.exports = {
    identifyAction({ command }) {
        if (isActionCreateBill({ command })){
            return ActionEnum.CreateBill;
        }

        if (isActionCloseSkills({ command })){
            return ActionEnum.CloseSkills;
        }

        if (isActionSendEmail({ command })){
            return ActionEnum.SendEmail;
        }

        return ActionEnum.NotUnderstand;
    },

    identifyKontragent({ command }) {
        const keywordsStart = ' для ';
        const keywordsEnd = ' на ';

        return substring({ command, keywordsStart, keywordsEnd })
    },

    identifyProduct: function ({ command }) {
        const keywordsStart = ' на услугу ';
        const keywordsEnd = ' с ';

        return substring({ command, keywordsStart, keywordsEnd })
    },
};

function isActionCreateBill({ command }) {
    const commandLowerCase = command.toLowerCase();
    const keywordsBill = ['счет', 'счёта'];
    const keywordsAction = ['созд', 'выстав', 'сформир', 'состав', 'сгенерир', 'сдел'];

    const isBill = find(keywordsBill, commandLowerCase);
    const isCreate = find(keywordsAction, commandLowerCase);

    return isBill && isCreate;
}

function isActionSendEmail({ command }) {
    const commandLowerCase = command.toLowerCase();
    const keywordsSend = ['отправ'];

    return find(keywordsSend, commandLowerCase);
}

function isActionCloseSkills({ command }) {
    const commandLowerCase = command.toLowerCase();
    const keywordsClose = ['выйти', 'закрыть', 'закончить', 'все', 'всё', 'хватит'];

    return find(keywordsClose, commandLowerCase);
}

function find(keywords = [], command) {
    return keywords.some(k => command.indexOf(k) !== -1);
}

function substring({ command, keywordsStart, keywordsEnd }) {
    const commandLC = command.toLowerCase();
    const startIndex = commandLC.indexOf(keywordsStart);
    if (startIndex === -1) {
        return Promise.reject();
    }
    // todo организовать нормальную работу с пдежами    // todo организовать нормальную работу с пдежами
    let endIndex = commandLC.indexOf(keywordsEnd);
    if (endIndex === -1) {
        endIndex = commandLC.length - 1;// Удаляем два символа для игнорирования падежа
    }

    const string = commandLC.substring(startIndex + keywordsStart.length, endIndex).trim();
    const first = string.split(' ')[0];
    return Promise.resolve(first.substring(0, first.length - 2));
}