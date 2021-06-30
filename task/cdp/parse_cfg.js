
'use strict';

const glob = require("glob")
const fs = require('fs')
const ltrim = require('ltrim');
const trim = require('trim');
const moment = require('moment');

function parseCfg() {
    //glob.sync("**/file/*");
    var path = './file/';
    var result = glob.sync(path + "*.cfg");

    function readFile() {
        var res = []
        for (var item of result) {
            res.push(fs.readFileSync(item, 'utf8'))
        }

        return res
    }

    //---------------------------------------------------------------------------------------------

    var file = readFile()

    //---------------------------------------------------------------------------------------------

    function remove_trash(files) {
        var res = []
        for (var item of files) {
            var split = item.split('Platform  Port ID')
            var split_2 = split[1].split("Total cdp entries displayed");
            var split_3 = split_2[0].split("\n");
            res.push(split_3)
        }
        return res;
    }

    //---------------------------------------------------------------------------------------------

    var _remove_trash = remove_trash(file);

    //---------------------------------------------------------------------------------------------

    function getDeviceID(index) {
        var data = _remove_trash[index]
        var result = [];
        for (var item of data) {
            if (item.includes('JIE') && item.includes('pamapersada')) {
                result.push({ 'Device ID': item })
            }
        }
        return result
        //'Device ID': result

    }

    //---------------------------------------------------------------------------------------------

    function get_LocalInterface_HoldTime(extrax, index) {
        var data = _remove_trash[index]
        var result = []
        var i = 0;
        var filter_array = []
        var ex = []


        //Mengambil data yg hanya mendangung JIE dan pamapersada
        //Menghapus Spasi
        for (var item of data) {
            if (item.includes('JIE') && item.includes('pamapersada')) {
                var datas = data[i + 1]
                datas = datas.split('  ').join('&')
                datas = datas.split('&')
                result.push(datas)
            }
            i++
        }

        //Menghapus data kosong
        var temp = '';
        var temp_ex = '';
        for (var items of result) {
            var i = 0;
            for (var item of items) {

                var x = item.length;
                if (item.length > 0) {
                    i++

                    if (i == 1) {
                        //filter_array.push(i + ' <== ' + ltrim(item));
                        temp = ltrim(item)
                    }

                    if (i == 2) {
                        var obj = {
                            'Local Interface': temp,
                            'Hold Time': ltrim(item)
                        }
                        filter_array.push(obj)
                        temp = ''
                    }

                    //Memisahkan Data Extrax
                    if (i == 3) {
                        temp_ex = ltrim(item)
                        ex.push(ltrim(item))
                    }

                    if (i == 4) {
                        ex[ex.length - 1] = ex[ex.length - 1] + ' ' + ltrim(item)
                    }
                    //console.log(i%4)


                }

            }
        }

        for (var i = 0; i <= 10; i++) {
            //console.log(i % 3)
        }


        if (extrax == 'ex') {
            return ex
        } else {
            return filter_array
            /*
            return {
                'Local Interface': filter_array[0],
                'Hold Time': filter_array[1]
            }*/
        }


    }

    //---------------------------------------------------------------------------------------------

    function get_Capability_Platform_PortID(index) {
        var data = get_LocalInterface_HoldTime('ex', index)

        var data_join = [];
        for (var item of data) {
            var join = item.split(' ').join('&')
            var seperate = stringBetween(join, '&', '-')
            var capability = join.split(seperate)[0].split('&').join('')
            var platform = seperate + join.split(seperate)[1].split('&')[0]
            var portID = trim(join.split(join.split(seperate)[1].split('&')[0])[1].split('&').join(' '))
            var obj = {
                'Capability': capability,
                'Platform': platform,
                'Port ID': portID
            }
            data_join.push(obj)
        }

        return data_join
    }

    //Fungsi untuk mendapatkan Text diantara 2 String
    function stringBetween(string, first, end) {
        var result = string.split(end)
        result = result[0]
        result = result.split(first)
        result = result[result.length - 1]
        return result
    }

    //---------------------------------------------------------------------------------------------

    //Fungsi Untuk menggabungkan Data
    function merger(data) {
        var merger = []
        var count = 0
        for (var index in data) {
            var task1 = getDeviceID(index)
            var task2 = get_LocalInterface_HoldTime(null, index)
            var task3 = get_Capability_Platform_PortID(index)
            var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

            for (var i in task1) {
                var obj = {
                    'No' : count + 1,
                    'File Name': data[index].split(path)[1],
                    'Device ID': task1[i]['Device ID'],
                    'Local Interface': task2[i]['Local Interface'],
                    'Hold Time': task2[i]['Hold Time'],
                    'Capability': task3[i]['Capability'],
                    'Platform': task3[i]['Platform'],
                    'Port ID': task3[i]['Port ID'],
                    'Time' : timestamp
                }
                merger.push(obj)
                count ++
            }
        }

        return merger
    }

    //---------------------------------------------------------------------------------------------

    return merger(result)
}


module.exports = { parseCfg };