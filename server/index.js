var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var api = require('./api');
var configurePassport = require('./config/passport');
var routing = require('./middleware/routing.mw');

var clientPath = path.join(__dirname, '../client');

var app = express();
app.use(express.static(clientPath));
app.use(cookieParser());
app.use(bodyParser.json());

configurePassport(app);

app.use('/api', api);

app.get('*', function(req, res, next) {
    if (isAsset(req.url)) {
        return next(); //Call the next route handler
    } else {
        res.sendFile(path.join(clientPath, 'index.html'));
    }
});

app.get('*', routing.stateRouting);
app.listen(3000);

function isAsset(path) {
    var pieces = path.split('/');
    if (pieces.length === 0) { return false; }
    var last = pieces[pieces.length - 1];
    if (path.indexOf('/api') !== -1 || path.indexOf('/?') !== -1) {
        return true;
    } else if (last.indexOf('.') !== -1) {
        return true;
    } else {
        return false;
    }
}