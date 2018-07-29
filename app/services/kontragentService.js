const requestPromise = require('request-promise');
const tokenService = require('./tokenService');

module.exports = {
  getKontragent({ fullName }){
      let name = fullName.split(' ')[0];
      name = name.substring(0, name.length - 2);
      return requestPromise({
          url: `https://restapi.moedelo.org/kontragents/api/v1/kontragent?name=${encodeURI(name)}`,
          method: 'GET',
          headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${tokenService.getToken()}`
          },
      }).then(resp => {
          return JSON.parse(resp).ResourceList
              .map(kontragent => ({
              Id: kontragent.Id,
              Name: kontragent.Name
          }));
      }).catch(e =>{
          console.log(e);
          return e;
      });
  }
};