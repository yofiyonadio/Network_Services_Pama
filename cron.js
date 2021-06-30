'use strict';
const cron = require('node-cron');
const parse = require("./task/office365/parse");
const task = require('./task/office365/post365');
const basic_ftp = require("./task/cdp/ftp");
const cdp_models = require('./model/cdp_model');
const functions = require('./function/function');
const unifi = require('./task/unifi/unifiApis')

cron.schedule('*/5 * * * * *', async () => { // every 5 seconds
    //office365Task()
    //cdpTask()
    //unifiTask()
    //console.log(functions.now())
});

cron.schedule('*/5 * * * *', async () => { // every minutes
    //office365Task()
    //cdpTask() 
    //unifiTask()
});

cron.schedule('0 * * * *', async () => { // every hours
    ///office365Task()
    //cdpTask()
    //unifiTask()
});

async function office365Task() {
    let html = await parse.parse();
    let post = await task.postApi(html)
    logger('Office 365 Run at ' + functions.now());
}

async function cdpTask() {
    basic_ftp.basicFTP()
        .then(async () => await cdp_models.insert()
            .then(() => logger('CDP Run at ' + functions.now()))
            .catch(error => logger(error)))
        .catch(error => logger(error))
};

async function unifiTask() {
    unifi.gets('client')
        .then(() => logger('Unifi Client Run at ' + functions.now()))
        .catch(error => logger(error))

    unifi.gets('device')
        .then(() => logger('Unifi Device Run at ' + functions.now()))
        .catch(error => logger(error))

    unifi.resetData()
        .then(() => logger('Unifi Reset Data Run at ' + functions.now()))
        .catch(error => logger(error))
}