'use strict';

const connection = require('../conn');
const queries = require('../function/query')
const moment = require('moment');

const dbo = connection.dbo

async function insertClient(data) {
    return await new Promise(async (resolve, reject) => {
        for (let item of data) {
            let obj = {
                timestamps: moment().format('YYYY-MM-DD HH:mm:ss'),
                url_site: item.url_site,
                name: item.name,
                user_id: item.user_id,
                ip: item.ip,
                mac: item.mac,
                hostname: item.hostname,
                ap_mac: item.ap_mac,
                ssid: item.ssid,
                usergroup_id: item.usergroup_id,
                uptime: item.uptime,
                download: item.download,
                upload: item.upload
            };

            let query = queries.insert_mssql(dbo + '.unifi_client', obj);

            await connection.mssql.query(query, function (error, rows, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                    //console.log(JSON.stringify(rows));
                }
            });
        }

    });
}

async function insertDevices(data) {
    return await new Promise(async (resolve, reject) => {
        for (let item of data) {
            let obj = {
                timestamps: moment().format('YYYY-MM-DD HH:mm:ss'),
                url_site: item.url_site,
                name: item.name,
                mac: item.mac,
                state: item.state,
                client: item.client,
                cpu: item.cpu,
                uptime: item.uptime
            };

            let query = queries.insert_mssql(dbo + '.unifi_device', obj);

            await connection.mssql.query(query, function (error, rows, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                    //console.log(JSON.stringify(rows));
                }
            });
        }

    });
}

async function resetData() {
    return await new Promise(async (resolve, reject) => {
        let minDate = moment().add(-30, 'd').format('YYYY-MM-DD HH:mm:ss');
        let query1 = `delete from dbo.unifi_client where timestamps < '${minDate}'`;
        let query2 = `delete from dbo.unifi_device where timestamps < '${minDate}'`;

        await connection.mssql.query(query1, function (error, rows, fields) {
            if (error) {
                reject(error);
            } 
        });
        await connection.mssql.query(query2, function (error, rows, fields) {
            if (error) {
                reject(error);
            }
        });
        resolve('Reset Success')
    })
}

async function getUser() {
    return await new Promise(async (resolve, reject) => {
        let query = `select * from dbo.unifi_user`;

        await connection.mssql.query(query, function (error, rows, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(rows.recordsets[0]);
            }
        });
    });
}

module.exports = { insertClient, insertDevices, resetData, getUser };