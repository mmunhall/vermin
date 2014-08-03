#!/usr/bin/env node

var program = require('./node_modules/commander');
var gpio = require('./node_modules/pi-gpio');

var PIN_LED = 7;

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
console.log("Running...");

function reset() {
    gpio.open(PIN_LED, "output", function(err) {
        gpio.write(PIN_LED, 0, function() {
            gpio.close(PIN_LED);
        });
    });
}

function exec() {

    var ledPinState = gpio.read(PIN_LED);

    gpio.open(PIN_LED, "output", function(err) {
        gpio.write(PIN_LED, 1, function() {
            gpio.close(PIN_LED);
        });
    });

    setInterval(exec, program.interval * 1000);
}

// reset();
exec();
