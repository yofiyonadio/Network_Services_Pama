var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    controller = require('./controller'),
    cron = require('./cron'),
    cors = require('cors');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(cors());
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

global.logger = function (log) {
    console.log(log)
}

global.jsons = function (json) {
    return JSON.stringify(json)
}

var routes = require('./routes');
routes(app);

var server = app.listen(port);
console.log('Network Application Server started on: ' + port);

//server.close(); //kill server