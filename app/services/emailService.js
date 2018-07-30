const moment = require('moment');
const requestPromise = require('request-promise');
const FormingNamesEnum = require('../enums/FormingNamesEnum');
const tokenService = require('./tokenService');

module.exports = {
    async send({ sessionContext }){
        const documentBaseId = sessionContext.lastCreateDocument[sessionContext.lastCreateDocument.length - 1].Id;
        const mailInfo = await requestPromise({
            url: `https://www.moedelo.org/Accounting/Bills/GetPreview?documentBaseId=${documentBaseId}`,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            }
          }).then(resp => JSON.parse(resp));
        return requestPromise({
            url: 'https://www.moedelo.org/Accounting/Mail/Send',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            },
            body: JSON.stringify({
                Attachments: [documentBaseId],
                Format: 1,
                UseStampAndSign: true,
                KontragentEmail: mailInfo.KontragentEmail,
                KontragentId: mailInfo.KontragentId,
                Subject: `Документ от ${sessionContext.getFullName({ forming: FormingNamesEnum.Genitive })}`,
                Message: `Добрый день.\nМы подготовили для Вас:\nСчет №${mailInfo.Number} от ${moment(mailInfo.Date, 'dd.mm.yyyy').locale("ru").format('DD MMM')}\n\nСсылка на оплату счета онлайн: ${mailInfo.DocumentUrl}\n\nС уважением,\n ${sessionContext.getFullName({ forming: FormingNamesEnum.Genitive })}`
            })
        })
  }
};