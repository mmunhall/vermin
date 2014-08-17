#!/usr/bin/env node

var program = require('./node_modules/commander');
var service = require('./vermin-service.js');
var pkg = require('./package');

function sanitizeEmail(val) {
    var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!emailRegex.test(val)) {
        console.log("***Invalid email.***");
    } else {
        return val;
    }
}

function sanitizeString(val) {
    if (val.trim().length > 0) {
        return val;
    } else {
        console.log("***String length 0***");
    }
}

program
  .version(pkg.version)
  .usage('./vermin.js [options]')
  .option('-e, --emailTo [emailTo]', 'Notification email to address', sanitizeEmail)
  .option('-f, --emailFrom [emailFrom]', 'Notification email from address', sanitizeEmail)
  .option('-p, --emailPass [emailPass]', 'Notification email transport password (assumes Gmail)', sanitizeString)
  .parse(process.argv);

// Validate all email options were provided or none were provided.
if (program.emailTo || program.emailFrom || program.emailPass) {
    if (!program.emailTo || !program.emailFrom || !program.emailPass) {
        console.log('If any of emailTo, emailFrom or emailPass are specified, all three parameters must be specified. Quitting now.');
        process.exit();
    }
}

console.log("Running... Press CTRL-C to quit.");

process.stdin.resume();
process.on('SIGINT', function () {
    service.stop();
});

service.start(program);
