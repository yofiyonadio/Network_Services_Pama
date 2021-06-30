var nodemailer = require('nodemailer');

function sendMail() {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secureConnection: true,
        port: 465,
        transportMethod: "SMTP",
        auth: {
            user: "yofiyonadio@gmail.com",
            pass: "mazmur911"
        }
    });

    var mailOptions = {
        to: 'yofiyonadio2@gmail.com',
        subject: 'Sending Email via Node.js',
        text: 'Test dari yofiyonadio@gmail.com Berhasil!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}