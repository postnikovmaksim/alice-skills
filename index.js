const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post('/', function (request, response) {
    response.json({success: true});
});

app.use('*', function (request, response) {
    response.sendStatus(404);
});

app.listen(port);