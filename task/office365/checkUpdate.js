'use strict';

const connection = require('../../conn');


function checkUpdate() {
    var query = `select * from ${update_365} t where t.send = 0;`
    connection.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            var result = rows.recordset;
            for (const type of result) {
                var res = type;
                var ids = res['ids'];
                var title = res['title'];
                var old_value = res['old_value'];
                var new_value = res['new_value'];
                var kolom = res['kolom'];
                var exports = {
                    ids: ids,
                    title: title,
                    old_value: old_value,
                    new_value: new_value,
                    kolom: kolom
                };
                if (result.length > 0) {
                    sendMail(exports, type);
                }
            }
        }
    });
}

module.exports = { checkUpdate };