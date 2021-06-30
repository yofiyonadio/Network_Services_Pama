'use strict';

const fetch = require('node-fetch');
const bytes = require('bytes');
const unifiModel = require('../../model/unifi_model')

const unifiToken = {
    unifises: '',
    csrf_token: ''
}

function unifiAuth(urls, username, password) {
    return new Promise(async (resolve, reject) => {
        const opts = {
            method: 'POST',
            headers: {
                //cookie: 'csrf_token=PRMq4EaUAlSZxzTgnyKmNY4dnokvJlS2; unifises=ISD79a0PHqv184x76mA1IESoMWy5oPW9',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };

        const url = `https://${urls}/api/login`

        let gets = await fetch(url, opts)
            .then(function (result) {
                let obj = {}
                result.headers.forEach(function (value, key) {
                    obj[key] = value
                });
                return obj
            })
            .catch(function (error) {
                let arrCookie = {
                    auth: false,
                    server: false
                }
                resolve(arrCookie)
            })

        let keys = Object.keys(gets)
        let isValid = keys.includes('set-cookie')

        if (isValid) {
            let getCookies = gets['set-cookie'].split(',')
            let arrCookie = {
                auth: true,
                server: true
            }

            for (let item of getCookies) {
                let itemSplit = item.split(';')
                let itemValues = itemSplit[0].split('=')
                arrCookie[itemValues[0].trim()] = itemValues[1].trim()

            }
            resolve(arrCookie)
        } else {
            let arrCookie = {
                auth: false,
                server: true
            }
            resolve(arrCookie)
        }


    })

}

async function unifiGetDevices(item) {
    return new Promise(async (resolve, reject) => {
        let opts = {
            method: 'GET',
            headers: {
                cookie: `csrf_token=${unifiToken.csrf_token}; unifises=${unifiToken.unifises}`,
                "Content-Type": "application/json"
            }
        };

        let url = `https://${item.url}/api/s/default/stat/device`

        function secToTime(sec) {
            let time = new Date(sec * 1000).toISOString().substr(11, 8)
            return time
        }

        function countClient(data) {
            let num = 0;
            for (let item of data) {
                if (item.num_sta !== undefined) {
                    num = num + item.num_sta
                } else {
                    num = null
                }
            }
            return num
        }

        function filterDevice(data) {
            let nulls = ''
            let arr = []
            let i = 0

            for (let e of data) {
                if (1 === 1 /*e.name !== undefined*/) {
                    i++
                    let obj = {
                        // !== undefined ? e. : nulls,
                        no: i,
                        url_site: item.url,
                        name: e.name !== undefined ? e.name : nulls,
                        mac: e.mac !== undefined ? e.mac : nulls,
                        state: e.state !== undefined ? e.state : nulls,
                        client: e['radio_table_stats'] !== undefined ? countClient(e['radio_table_stats']) : nulls,
                        cpu: e['system-stats'] !== undefined ? e['system-stats'].cpu !== undefined ? e['system-stats'].cpu : nulls : nulls,
                        uptime: e['system-stats'] !== undefined ? e['system-stats'].uptime !== undefined ? secToTime(e['system-stats'].uptime) : nulls : nulls,
                    }
                    arr.push(obj)
                }
            }

            return arr
        }

        let gets = await fetch(url, opts)
            .then(async function (result) {
                let datas = await result.text()
                let datasParse = JSON.parse(datas)
                let datasFilters = await filterDevice(datasParse.data)
                await unifiModel.insertDevices(datasFilters)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })

            })
            .catch(function (error) {
                reject(error)
            })
    })
}


async function unifiGetClient(item) {
    return new Promise(async (resolve, reject) => {
        const opts = {
            method: 'GET',
            headers: {
                cookie: `csrf_token=${unifiToken.csrf_token}; unifises=${unifiToken.unifises}`,
                "Content-Type": "application/json"
            }
        };

        const url = `https://${item.url}/api/s/default/stat/sta/`

        function secToTime(sec) {
            let time = new Date(sec * 1000).toISOString().substr(11, 8)
            return time
        }

        function filterClient(data) {
            let nulls = ''
            let arr = []
            let i = 0
            for (let e of data) {
                i++
                let obj = {
                    // !== undefined ? e. : nulls,
                    no: i,
                    url_site: item.url,
                    name: e.name !== undefined ? e.name : nulls,
                    user_id: e.user_id !== undefined ? e.user_id : nulls,
                    ip: e.ip !== undefined ? e.ip : nulls,
                    mac: e.mac !== undefined ? e.mac : nulls,
                    hostname: e.hostname !== undefined ? e.hostname : nulls,
                    ap_mac: e.ap_mac !== undefined ? e.ap_mac : nulls,
                    ssid: e.bssid !== undefined ? e.bssid : nulls,
                    usergroup_id: e.usergroup_id !== undefined ? e.usergroup_id : nulls,
                    uptime: e.uptime !== undefined ? secToTime(e.uptime) : nulls,
                    download: e.tx_bytes !== undefined ? e.tx_bytes : nulls,
                    upload: e.rx_bytes !== undefined ? e.rx_bytes : nulls,
                }
                arr.push(obj)
            }
            return arr
        }

        let gets = await fetch(url, opts)
            .then(async function (result) {
                let datas = await result.text()
                let datasParse = JSON.parse(datas)
                let datasFilters = await filterClient(datasParse.data)
                await unifiModel.insertClient(datasFilters)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })

            })
            .catch(function (error) {
                reject(error)
            })
    })
}


async function gets(func, param_tes) {
    return await control(func, param_tes)
}

async function control(func, param_tes) {
    let users = await unifiModel.getUser()
    let failed = false;
    let result
    let indexx = 0;
    let success = []
    let faileds = []
    for (let item of users) {
        let server = false
        let auth = false
        await unifiAuth(item.url, item.username, item.password)
            .then(async res => {
                unifiToken.unifises = res.unifises
                unifiToken.csrf_token = res.csrf_token
                auth = res.auth
                server = res.server
            })
            .catch(err => {
                return err
            })

        if (server) {
            if (auth) {
                if (func === "client") {
                    if (param_tes === undefined) {
                        let ress = await unifiGetClient(item);
                        if (ress.length > 0) {
                            indexx = indexx + 1
                            success.push(item.url)
                        }
                        if (!failed) {
                            result = "OK!"
                        }
                    } else if (param_tes === "tes") {
                        success.push(item.url)
                    }

                } else if (func === "device") {
                    if (param_tes === undefined) {
                        let ress = await unifiGetDevices(item)
                        if (ress.length > 0) {
                            indexx = indexx + 1
                            success.push(item.url)
                        }
                        if (!failed) {
                            result = "OK!"
                        }
                    } else if (param_tes === "tes") {
                        success.push(item.url)
                    }

                } else {
                    failed = true
                    return 'function not found.'
                }
            } else {
                failed = true
                faileds.push(item.url + " (Auth Failed)")
                result = "Some Auth Failed."
            }
        } else {
            failed = true
            faileds.push(item.url + " (Server Failed)")
            result = "Some Server Failed."
        }
    }
    //console.log(success)
    /*
    return {
        task_result : indexx + " from " + users.length + " task Success",
        task_status : result
    }
    */
    return {
        success: success,
        faileds: faileds
    }
}

async function resetData() {
    return await unifiModel.resetData()
}

async function getUser() {
    return await unifiModel.getUser()
}

module.exports = { gets, resetData, getUser };