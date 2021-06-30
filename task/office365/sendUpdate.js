'use strict';

const connection = require('./conn');


function sendUpdate(result) {
    var res = result;
    var id = res['id'];
    var query = `UPDATE ${update_365} set send = 1 where id = ${id}`;
    connection.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            if (result.length > 0) {
                //console.log(`berhasil`);
            }
        }
    });
}

module.exports = { sendUpdate };
