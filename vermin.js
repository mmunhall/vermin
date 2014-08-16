#!/usr/bin/env node

var program = require('./node_modules/commander');
var service = require('./vermin-service.js');

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
  .usage('./vermin.js')
  .option('-i, --interval [number]', 'Polling interval, in seconds', sanitizeInterval, 5)
  .option('-e, --email [email]', 'Notification email address', sanitizeEmail, 'me@example.com')
  .parse(process.argv);

console.log('interval: %j', program.interval);
console.log('email: %j', program.email);
console.log("Running... Press CTRL-C to quit.");

service.start();
