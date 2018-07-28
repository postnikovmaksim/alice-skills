const requestPromise = require('request-promise');
const tokenService = require('./tokenService');

module.exports = {
    getProduct({ name }){
        return requestPromise({
            url: `https://restapi.moedelo.org/stock/api/v1/good?name=${encodeURI(name)}`,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${tokenService.getToken()}`
            },
        }).then(resp => {
            return JSON.parse(resp).ResourceList.map( product => ({
                StockProductId: product.Id,
                Name: product.Name,
                Unit: product.UnitOfMeasurement,
                Count: 1, //пока-что одну штуку
                Price: product.SalePrice
            }));
        }).catch(e =>{
            console.log(e);
            return e;
        });
    }
};