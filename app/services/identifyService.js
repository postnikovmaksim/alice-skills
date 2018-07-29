const ActionEnum = require('../enums/ActionEnum');

const predlog = ['в', 'без', 'до', 'из', 'к', 'на', 'по', 'о', 'от', 'перед', 'при', 'через', 'с', 'у', 'за', 'над', 'об', 'под', 'про', 'для'];

module.exports = {
    identifyAction({ command }) {
        if (isActionCreateBill({ command })){
            if (isActionCreateBillContract({ command })){
                return ActionEnum.CreateBillContract;
            }

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
        const keywords = ['с контрагентом', 'для контрагента', 'для', 'на', 'с'];
        const excludeWords = ['услуга', 'услугой', 'услуги', 'услугами', 'товар', 'товаром', 'товары', 'товарами'];
        const commandByWord = command.split(' ');

        const indexKeyWord = findIndexKeyWord({ commandByWord, keywords, excludeWords: excludeWords });
        if(indexKeyWord !== -1 && commandByWord.length - 1 !== indexKeyWord){
            return Promise.resolve(joinPhrase({ commandByWord, indexKeyWord }));
        }

        return Promise.reject('');
    },

    identifyProduct: function ({ command }) {
        const keywords = ['на услугу', 'с услугой', 'на товар', 'с товаром'];
        const excludeWords = [];
        const commandByWord = command.split(' ');

        const indexKeyWord = findIndexKeyWord({ commandByWord, keywords, excludeWords: excludeWords });
        if(indexKeyWord !== -1 && commandByWord.length - 1 !== indexKeyWord){
            return Promise.resolve(joinPhrase({ commandByWord, indexKeyWord }));
        }

        return Promise.reject('');
    },
};

function isActionCreateBill({ command }) {
    const commandLowerCase = command.toLowerCase();
    const keywordsBill = ['счет', 'счёт'];
    const keywordsAction = ['созд', 'выстав', 'сформир', 'состав', 'сгенерир', 'сдел'];

    const isBill = find(keywordsBill, commandLowerCase);
    const isCreate = find(keywordsAction, commandLowerCase);

    return isBill && isCreate;
}

function isActionCreateBillContract({ command }) {
    const commandLowerCase = command.toLowerCase();
    const keywordsBillContract = ['договор'];

    return find(keywordsBillContract, commandLowerCase);
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

function findIndexKeyWord({ commandByWord, keywords, excludeWords }) {
     for (let i = 0; i < commandByWord.length; i = i + 1){
         let keyIndex = 0;
        for (let j = 0; j < keywords.length; j++) {
            keyIndex = getKeyWordLastIndex({ key: keywords[j], commandByWord, index: i });
            if (keyIndex !== -1) {
                break;
            }
        }

       if (keyIndex !== -1) {
           i = keyIndex;
           if(i < commandByWord.length - 1){
               const isExcludeWords = excludeWords.some(exclude => commandByWord[keyIndex + 1] === exclude);
               if(!isExcludeWords){
                   return keyIndex;
               }
           }
       }
    }

    return -1;
}

function getKeyWordLastIndex({ key, commandByWord, index }){
    const keyByWord = key.split(' ');
    let keyWordLastIndex = index + keyByWord.length;

    return key === commandByWord.slice(index, keyWordLastIndex).join(' ') ? keyWordLastIndex - 1 : -1;
}

function joinPhrase({ commandByWord, indexKeyWord }) {
    const result = [];
    let i = indexKeyWord + 1;

    while (canTakeWords(commandByWord, i, predlog)) {
        result.push(commandByWord[i]);
        i++;
    }
    
    return result.join(' ');
}

function canTakeWords(commandByWord, i, predlog) {
    return i <= commandByWord.length - 1 && !predlog.some(pred => pred === commandByWord[i]);
}