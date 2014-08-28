// var sys = require('sys');
var exec = require('child_process').exec;

module.exports = {
    capture: function () {
        exec("raspistill -o 1.jpg");
    }
}