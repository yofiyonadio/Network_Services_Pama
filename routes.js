'use strict';

module.exports = function (app) {
    var todoList = require('./controller');
    app.route('/')
        .get(todoList.index);

    app.route('/o365')
        .get(todoList.o365);

    app.route('/cdp')
        .get(todoList.cdp);

    app.route('/unifi/:function')
        .get(todoList.unifi);

    app.route('/unifi/:function/:tes')
        .get(todoList.unifi);

    app.route('/kill')
        .get(todoList.kill);

    app.route('/tes')
        .get(todoList.tes);

};