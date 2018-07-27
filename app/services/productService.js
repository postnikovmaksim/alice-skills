const requestPromise = require('request-promise');
const tokenService = require('./tokenService');

module.exports = {
    getProduct(){
        return requestPromise({
            url: 'https://restapi.moedelo.org/stock/api/v1/good',
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            },
        }).then(resp => {
            const product = JSON.parse(resp).ResourceList[0];
            return {
                StockProductId: product.Id,
                Name: product.Name,
                Unit: product.UnitOfMeasurement,
                Count: 1, //пока-что одну штуку
                Price: product.SalePrice
            };
        }).catch(e =>{
            console.log(e);
            return e;
        });
    }
};