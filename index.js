const express = require('express');
const router = require('./app/router');
const tokenService = require('./app/services/tokenService');
const accessService = require('./app/services/accessService');
const contextService = require('./app/services/contextService');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post('/setToken/', function ({ body }, response) {
    tokenService.setToken({newToken: body.token});
    response.json({message: `Новый токен успешно установлен = ${tokenService.getToken()}`});
});

app.post('/', async function ({ body }, response) {
    const { session } = body;

    accessService.validation({ session });

    const sessionContext = contextService.get(body);
    const message = await router.rout({ sessionContext });
    createResponse({ session, response, message });
});

app.use('*', function (request, response) {
    response.sendStatus(404);
});

app.listen(port);

function createResponse({session, response, message}) {
    response.json({
        response: Object.assign({end_session: false}, message),
        session: session,
        version: "1.0"
})
}