const requestPromise = require('request-promise');
const tokenService = require('./tokenService');

module.exports = {
  getKontragent(){
      return requestPromise({
          url: 'https://restapi.moedelo.org/kontragents/api/v1/kontragent',
          method: 'GET',
          headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${tokenService.getToken()}`
          },
      }).then(resp => {
          const kontragent = JSON.parse(resp).ResourceList[0];
          return {
              Id: kontragent.Id,
              Name: kontragent.Name
          };
      }).catch(e =>{
          console.log(e);
          return e;
      });
  }
};