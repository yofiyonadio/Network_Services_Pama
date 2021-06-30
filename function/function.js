const moment = require('moment');

exports.now = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}
