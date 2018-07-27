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

        requestPromise({
            url: 'https://restapi.moedelo.org/accounting/api/v1/sales/bill',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            },
            json: true,
            body: {
                "DocDate": "2018-07-27T00:00:00+03:00",
                "Type": 1, // Обычный счет
                "KontragentId": kontragent.Id,
                "NdsPositionType": 3, // НДС сверху
                "Items": items
            }
        }).catch((e) =>{
            console.log(e);
        })
    }
};