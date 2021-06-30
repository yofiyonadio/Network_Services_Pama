'use strict';

const response = require('./res');
const parse = require("./task/office365/parse");
const postApi = require("./task/office365/post365");
const basic_ftp = require("./task/cdp/ftp");
const cdp_models = require('./model/cdp_model');
const unifi = require('./task/unifi/unifiApis');
const nodemon = require('nodemon');

const fetch = require('node-fetch');
const ProxyAgent = require('proxy-agent');

//------------------------------------------------------------------------------------------------------------------

exports.index = function (req, res) {
    response.ok("Hello Pama Persada, This is a Network Application Server v4.0", res)
};

//-------------------------------------------------------------------------------------

exports.o365 = async function (req, res) {
    var html = await parse.parse();
    await postApi.postApi(html).then(result => {
        response.ok(result, res);
    }).catch(err => {
        response.ok(err.message, res);
    });
};

//-------------------------------------------------------------------------------------

exports.cdp = async function (req, res) {
    await basic_ftp.basicFTP()
        .then(async result_ftp => await cdp_models.insert()
            .then(result_insert => response.ok({ ftp: result_ftp, cdp: result_insert }, res))
            .catch(error => response.ok(error, res)))
        .catch(error => response.ok(error, res))
};

exports.unifi = async function (req, res) {
    //let resp = await unifi.resetData(req.params.function)
    let params = req.params.function
    let param_tes = req.params.tes

    let status = "success"
    let result = "no data"

    if (params === 'client') {
        result = await unifi.gets(params, param_tes);
    } else if (params === 'device') {
        result = await unifi.gets(params, param_tes)
    } else if (params === 'reset') {
        result = await unifi.resetData()
    } else if (params === 'user') {
        result = await unifi.getUser()
    } else {
        status = 'function not found.'
    }

    response.text({
        status: status,
        data: result
    }, res)
};

exports.kill = function (req, res) {
    const express = require('express');
    const app = express();
    const port = process.env.PORT || 3000;
    const server = app.listen(port);
    server.close();
    response.ok("server kill", res)
};


// force a quit


exports.tes = async function (req, res) {
    //response.text('oke', res)
    const proxyAgent = new ProxyAgent('http://10.2.180.190:8080');
    const opts = {
        method: 'POST',
        headers: {
            //cookie: 'csrf_token=PRMq4EaUAlSZxzTgnyKmNY4dnokvJlS2; unifises=ISD79a0PHqv184x76mA1IESoMWy5oPW9',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: 'pamabrcb',
            password: 'persada123'
        })
    };

    const url = `https://10.166.5.45:8443/api/login`
    //const url = `https://www.google.com/`    

    let gets = await fetch(url, opts)
        .then(function (result) {
            let obj = {}
                result.headers.forEach(function (value, key) {
                    obj[key] = value
                });
            response.text(obj, res)
        })
        .catch(function (error) {
            response.text(error, res)
        })
};

