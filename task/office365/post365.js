'use strict';

const connection = require('../../conn');

var moment = require('moment');



const office_365 = connection.dbo + '.microsoft_365';
const update_365 = connection.dbo + '.update_365'

async function postApi(datass) {
    return await new Promise((resolve, reject) => {
        for (const datas of datass) {
            for (const i in datas) {
                if (i > 0) {
                    var _datas = datas[i];
                    var ids = _datas[0];
                    var category = _datas[1];
                    var er = _datas[2];
                    var addresses = _datas[3];
                    var ports = _datas[4];
                    var title = _datas[5];
                    var last_update = _datas[6];
                    var status = '';
                    var timeupdate = '';
                    var timestamps = moment().format('YYYY-MM-DD HH:mm:ss');
                    var query = `
                DECLARE @category VARCHAR (1000) = (SELECT category FROM ${office_365} WHERE ids = '${ids}' AND title = '${title}');
                DECLARE @addresses VARCHAR (MAX) = (SELECT addresses FROM ${office_365} WHERE ids = '${ids}' AND title = '${title}');
                DECLARE @ports VARCHAR (50) = (SELECT ports FROM ${office_365} WHERE ids = '${ids}' AND title = '${title}');
                DECLARE @er VARCHAR (20) = (SELECT er FROM ${office_365} WHERE ids = '${ids}' AND title = '${title}');
                DECLARE @status VARCHAR (1000) = '';
                DECLARE @statusjoin VARCHAR (1000) = '';
    
                IF (@category != '${category}')
                BEGIN
                INSERT INTO ${update_365} (ids, title, old_value, new_value, kolom, timestamps)
                VALUES (${ids}, '${title}', @category, '${category}', 'category', '${timestamps}');
    
                IF (LEN(@status) > 1)
                SET @status = @status + ', category';
                ELSE
                SET @status = 'category';
                END;
    
                IF (@addresses != '${addresses}')
                BEGIN
                INSERT INTO ${update_365} (ids, title, old_value, new_value, kolom, timestamps)
                VALUES (${ids}, '${title}', @addresses, '${addresses}', 'addresses', '${timestamps}');
    
                IF (LEN(@status) > 1)
                SET @status = @status + ', addresses';
                ELSE
                SET @status = 'addresses';
                END;
    
                IF (@ports != '${ports}')
                BEGIN
                INSERT INTO ${update_365} (ids, title, old_value, new_value, kolom, timestamps)
                VALUES (${ids}, '${title}', @ports, '${ports}', 'ports', '${timestamps}');
    
                IF (LEN(@status) > 1)
                SET @status = @status + ', ports';
                ELSE
                SET @status = 'ports';
                END;
    
                IF (@er != '${er}')
                BEGIN
                INSERT INTO ${update_365} (ids, title, old_value, new_value, kolom, timestamps)
                VALUES (${ids}, '${title}', @er, '${er}', 'er', '${timestamps}');
    
                IF (LEN(@status) > 1)
                SET @status = @status + ', er';
                ELSE
                SET @status = 'er';
                END;
    
                MERGE INTO ${office_365} AS t
                USING
                (SELECT ids = ${ids}, title = '${title}', category = '${category}', er = '${er}', addresses = '${addresses}',
                ports = '${ports}', last_update = '${last_update}', timestamps = '${timestamps}') AS s
    
                ON t.ids = s.ids AND t.title = s.title
    
                WHEN MATCHED THEN
    
                UPDATE SET ids = s.ids, title = s.title, category = s.category, er = s.er, addresses = s.addresses,
                ports = s.ports, last_update = s.last_update, timestamps = s.timestamps
    
                WHEN NOT MATCHED THEN
    
                INSERT (ids, title, category, er, addresses, ports, last_update, timestamps)
                VALUES (s.ids, s.title, s.category, s.er, s.addresses, s.ports, s.last_update, s.timestamps);
                `;
                    connection.mssql.query(query, function (error, rows, fields) {
                        if (error) {
                            reject(error);
                        } else {
                            var timestamps = moment().format('YYYY-MM-DD HH:mm:ss');
                            resolve(`Post Berhasil pada ${timestamps}`);
                        }
                    });
                }
            };
        }
    });
}

module.exports = { postApi };