var gpio = require("./node_modules/pi-gpio");

var LED_PIN          = 7,           // Pi pin number for LED circuit
    MONITOR_PIN      = 11;          // Pi pin number for monitor circuit
    MONITOR_INTERVAL = 2000;        // Number of milliseconds before LED blinks while monitoring trap
    HIT_INTERVAL     = 250;         // Number of milliseconds before LED blinks once trap is triggered.
    POLL_INTERVAL    = 10000;       // Number of milliseconds between polling the monitor circuit for its state
    currentState     = "monitoring" // One of "monitoring" or "hit"

module.exports = {
    start: function () {
        setLedHigh(MONITOR_INTERVAL);
    }
}

function poll () {

}

function notify () {

}

function setLedHigh () {
    var interval = current_state = "monitoring" ? MONITOR_INTERVAL : HIT_INTERVAL;

    gpio.open(LED_PIN, "output", function(err) {
        gpio.write(LED_PIN, 1, function() {
            gpio.close(LED_PIN);

            setTimeout(setLedLow, interval);
        });
    });
}

function setLedLow () {
    gpio.open(LED_PIN, "output", function(err) {
        gpio.write(LED_PIN, 0, function() {
            gpio.close(LED_PIN);

            setTimeout(setLedHigh, 250);
        });
    });
}








// function exec() {
//     gpio.open(PIN_MONITOR, "input", function(err) {
//         gpio.read(PIN_MONITOR, function(err, value) {
//             console.log(value);
//             monitor_state = value;
//             gpio.close(PIN_MONITOR);
//         });
//     });
//
//     gpio.open(PIN_LED, "output", function(err) {
//         gpio.write(PIN_LED, monitor_state, function() {
//             console.log("monitor_state: " + monitor_state);
//             gpio.close(PIN_LED);
//         });
//     });
//
//     setTimeout(exec, 2000);
// }
//
// exec();
