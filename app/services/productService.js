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
            const response = JSON.parse(resp);
            return response.ResourceList[0];
        }).catch(e =>{
            console.log(e);
            return e;
        });
    }
};