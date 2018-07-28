const moment = require('moment');
const requestPromise = require('request-promise');
const FormingNamesEnum = require('../enums/FormingNamesEnum');
const tokenService = require('./tokenService');

module.exports = {
    async send({ sessionContext }){
        const documentBaseId = sessionContext.lastCreateDocument;
        const mailInfo = await requestPromise({
            url: `https://www.moedelo.org/Accounting/Bills/GetPreview?documentBaseId=${documentBaseId}`,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            }
          });
        return requestPromise({
            url: 'https://www.moedelo.org/Accounting/Mail/Send',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            },
            body:{
                Attachments: [documentBaseId],
                Format: 1,
                KontragentEmail: mailInfo.KontragentEmail,
                KontragentId: mailInfo.KontragentId,
                Subject: `Документ от ${sessionContext.getFullName({ forming: FormingNamesEnum.Genitive })}`,
                Message: `Добрый день.\nМы подготовили для Вас:\nСчет №${mailInfo.Number} от ${moment(mailInfo.Date).locale("ru").format('dd MMM')}\n\nСсылка на оплату счета онлайн: ${mailInfo.DocumentUrl}\n\nС уважением,\n ${sessionContext.getFullName({ forming: FormingNamesEnum.Genitive })}`
            }
        })
  }
};