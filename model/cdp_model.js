'use strict';

const connection = require('../conn');
const parse_cfg = require('../task/cdp/parse_cfg');
const query = require('../function/query');
const moment = require('moment');

const dbo = connection.dbo

async function insert() {
    return await new Promise((resolve, reject) => {
        var parse = parse_cfg.parseCfg();
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        logger(parse.length)
        for (var item of parse) {
            //console.log(item['Device ID']);
            insert(item)
        }

        async function insert(item) {
            var field_obj = {
                'timestamps': now,
                'file_name': item['File Name'],
                'device_id': item['Device ID'],
                'local_interface': item['Local Interface'],
                'hold_time': item['Hold Time'],
                'capability': item.Capability,
                'platform': item.Platform,
                'port_id': item['Port ID']
            }

            var sql = query.insert_update_mssql(dbo + '.cdp', field_obj, ['device_id', 'port_id']);

            await connection.mssql.query(sql, function (error, rows, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(parse);
                    //console.log(JSON.stringify(rows));
                }
            });
        }

    });

}


module.exports = { insert };