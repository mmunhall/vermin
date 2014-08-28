var nodemailer = require('nodemailer');

module.exports = {
    sendMessage: function (options) {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: options.from,
                pass: options.pass
            }
        });

        var message = {
            from: options.from,
            to: options.to,
            subject: 'Vermin Trap Triggered',
            text: "Your Vermin trap was triggered! Check the trap for vermin.\n\n",
            attachments: [
                {
                    path: options.imagePath,
                    fileName: 'vermin.jpg',
                    contentType: 'image/jpg'
                }
            ]
        };

        transporter.sendMail(message, function (err, info) {
            if (err) {
                console.log('Unable to send message: ', message);
                console.log(err);
            }
        });
    }
}
