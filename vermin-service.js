var gpio = require("./node_modules/pi-gpio");

var LED_PIN          = 7,           // Pi pin number for LED circuit
    MONITOR_PIN      = 11;          // Pi pin number for monitor circuit
    MONITOR_INTERVAL = 2000;        // Number of milliseconds before LED blinks while monitoring trap
    HIT_INTERVAL     = 250;         // Number of milliseconds before LED blinks once trap is triggered.
    POLL_INTERVAL    = 1000;        // Number of milliseconds between polling the monitor circuit for its state
    LOW		     = 0;           // LED LOW
    HIGH	     = 1;	    // LED HIGH
    currentState     = "monitoring" // One of "monitoring" or "hit". Initialized to "monitoring" at startup. Could mutate when polling.

module.exports = {
    start: function () {
    	init();
    	cycleLedHigh();
        setInterval(execute, POLL_INTERVAL);
    }
}

function init () {
    gpio.open(MONITOR_PIN, "input", function(err) { });
    gpio.open(LED_PIN, "output", function(err) { });
}

function execute () {    
    gpio.read(MONITOR_PIN, function(err, value) {
    	console.log(value);
        //currentState = "hit";
    });
    //console.log(currentState);
}

function notify () {

}

function readTrap () {

}

function cycleLedHigh () {
    var interval = currentState === "monitoring" ? MONITOR_INTERVAL : HIT_INTERVAL;

    setLed(HIGH, function () {
    	setTimeout(cycleLedLow, interval);
    });
}

function cycleLedLow () {
    setLed(LOW, function () {
    	setTimeout(cycleLedHigh, 250);
    });
}

function setLed(value, callback) {
    gpio.write(LED_PIN, value, function() {
        if (callback) { callback(); }
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
