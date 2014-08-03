#!/usr/bin/env node

var program = require('./node_modules/commander');
//var gpio = require('./node_modules/pi-gpio');

function sanitizeInterval(val) {
    var interval = parseInt(val, 10);
    if (isNaN(val)) {
        console.log("***Invalid interval passed. Setting to the default.***");
        return 5;
    } else {
        return interval;
    }
}

function sanitizeEmail(val) {
    var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!emailRegex.test(val)) {
        console.log("***Invalid email passed. Setting to the default.***");
        return "me@example.com";
    } else {
        return val;
    }
}

program
  .version('0.0.1')
  .usage('test')
  .option('-i, --interval [number]', 'Polling interval, in seconds', sanitizeInterval, 5)
  .option('-e, --email [email]', 'Notification email address', sanitizeEmail, 'me@example.com')
  .parse(process.argv);

console.log('interval: %j', program.interval);
console.log('email: %j', program.email);
console.log("Running...");

function exec() {

    gpio.open(7, "output", function(err) {
        gpio.write(7, 1, function() {
            gpio.close(7);
        });
    });

    setInterval(exec, program.interval * 1000);
}

exec();
