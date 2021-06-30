'use strict';

const nodemailer = require('nodemailer');

var moment = require('moment');

function sendMail(exports, result) {
    var val = exports;
    var ids = val['ids'];
    var title = val['title'];
    var old_value = val['old_value'];
    var new_value = val['new_value'];
    var kolom = val['kolom'];
    var gmail = "cis.pamapersada@gmail.com";
    var timestamps = moment().format('DD/MM/YYYY HH:mm');
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secureConnection: true,
        port: 465,
        transportMethod: "SMTP",
        auth: {
            user: gmail,
            pass: "mazmur5015"
        }
    });
    var text = `Tanggal: ${timestamps} \n\nID: ${ids} \nTitle: ${title} \nColumn: ${kolom} \n\nNEW VALUE: \n${new_value} \n\nOLD Value: \n${old_value}`;
    var mailOptions = {
        from: gmail,
        to: 'yofiyonadio2@gmail.com',
        subject: `(Office 365) Terjadi perubahan data ${title} pada kolom ${kolom}`,
        text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            sendUpdate(result);
            console.log('Email sent: ' + info.response);
        }
    });
    console.log(text);
}

module.exports = { sendMail };