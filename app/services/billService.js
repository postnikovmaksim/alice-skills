const moment = require('moment');
const requestPromise = require('request-promise');
const tokenService = require('./tokenService');

module.exports = {
    create({kontragent, products}){
        const items = products.map(product => ({
            "StockProductId": product.StockProductId,
            "Type": 1, // Товар
            "Name": product.Name,
            "Unit": product.Unit,
            "Count": product.Count,
            "Price": product.Price
        }));

        return requestPromise({
            url: 'https://restapi.moedelo.org/accounting/api/v1/sales/bill',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            },
            json: true,
            body: {
                "DocDate": moment().format(),
                "Type": 1, // Обычный счет
                "KontragentId": kontragent.Id,
                "NdsPositionType": 3, // НДС сверху,
                "UseStampAndSign": true,
                "Items": items
            }
        })
    }
};
