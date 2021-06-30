'use strict';

function insert_update_mssql(table_name, field_obj, pair_arr) {

    var field_arr = Object.keys(field_obj)

    function field_obj_join() {
        var arr = []

        for (var item of field_arr) {
            arr.push(item + ` = '${field_obj[item]}'`);
        }
        return arr.join(', ')
    }

    function field_obj_update() {
        var arr = []
        for (var item of field_arr) {
            arr.push(`t.${item} = s.${item}`);
        }
        return arr.join(', ')
    }

    function field_obj_insert() {
        return field_arr.join(', ')
    }

    function field_obj_insert_value() {
        var arr = []
        for (var item of field_arr) {
            arr.push(`s.${item}`);
        }
        return arr.join(', ')
    }

    function field_pair_string() {
        var arr = []
        for (var item of pair_arr) {
            arr.push(`t.${item} = s.${item}`);
        }
        return arr.join(' AND ')
    }

    //field_obj_join()
    //console.log(field_pair_string());

    var sql = `MERGE INTO ${table_name} AS t
USING 
(SELECT ${field_obj_join()}) AS s
ON ${field_pair_string()}
WHEN MATCHED THEN
UPDATE SET ${field_obj_update()}
WHEN NOT MATCHED THEN
INSERT (${field_obj_insert()})
VALUES (${field_obj_insert_value()});`;

    return sql

}

function insert_mssql(table_name, field_obj) {
    let field_keys = Object.keys(field_obj)
    let field_vals = Object.values(field_obj)
    for (let i in field_vals) {
        field_vals[i] = "'" + field_vals[i] + "'"
    }
    let query = `INSERT INTO ${table_name} (${field_keys}) VALUES (${field_vals})`
    return query
}

module.exports = { insert_update_mssql, insert_mssql };