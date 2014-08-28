// var sys = require('sys');
var exec = require('child_process').exec;

module.exports = {
    capture: function () {
        var fileName = "img_" + new Date().valueOf() + ".jpg";
        exec("raspistill -o imgCapture/" + fileName);
    }
}