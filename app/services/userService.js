const requestPromise = require('request-promise');
const tokenService = require('./tokenService');

module.exports = {
  getUserName(){
      return requestPromise({
          url: 'https://www.moedelo.org/Requisites/Master/GetInfo',
          method: 'GET',
          headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${tokenService.getToken()}`
          },
      }).then(resp => {
          const response = JSON.parse(resp);
          console.log(response);
          return `${response.Value.DirectorInfo.Name} ${response.Value.DirectorInfo.Patronymic}`;
      }).catch(e =>{
          console.log(e);
      return e;
      });
  }
};