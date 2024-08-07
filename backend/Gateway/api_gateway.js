const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));

function selectProxyHost(req) {
    if (req.path.startsWith('/LogPortao') || (req.path.startsWith('/LogPortao-Mobile')) || (req.path.startsWith('/GetLogPortao')) )
        return 'http://localhost:8080/';
    else if(req.path.startsWith('/ControlePortao'))
        return 'http://localhost:8090/'
}

app.use((req, res, next) => {
    var proxyHost = selectProxyHost(req);
    if (proxyHost == null)
        res.status(404).send('Not found');
    else
        httpProxy(proxyHost)(req, res, next);
});

app.listen(8000, () => {
    console.log('API Gateway iniciado!');
});