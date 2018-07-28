const ActionEnum = require('../enums/ActionEnum');

module.exports = {
    identifyAction({ command }) {
        if (isActionCreateBill({ command })){
            return ActionEnum.CreateBill;
        }
        return ActionEnum.NotUnderstand;
    },

    identifyKontragent({ command }) {
        const keywordsStart = ' для ';
        const keywordsEnd = ' на ';

        return substring({ command: command.toLowerCase(), keywordsStart, keywordsEnd })
    },

    identifyProduct: function ({ command }) {
        const keywordsStart = ' на ';
        const keywordsEnd = ' с ';

        return substring({ command: command.toLowerCase(), keywordsStart, keywordsEnd })
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

function find(keywords = [], command) {
    return keywords.some(k => command.indexOf(k) !== -1);
}

function substring({ command, keywordsStart, keywordsEnd }) {
    const startIndex = command.indexOf(keywordsStart);
    if (startIndex === -1) {
        return Promise.reject();
    }

    let endIndex = command.indexOf(keywordsEnd);
    if (endIndex === -1) {
        endIndex = command.length - 1;
    }

    return Promise.resolve(command.substring(startIndex + keywordsStart.length, endIndex).trim());
}