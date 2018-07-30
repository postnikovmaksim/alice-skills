const requestPromise = require('request-promise');

module.exports = {
  send({ body }){
      requestPromise({
          url: 'http://logs-01.loggly.com/inputs/41c0dbf8-e607-4f4c-b69d-9d66573d3bba/tag/http/',
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body)
      });
  }
};