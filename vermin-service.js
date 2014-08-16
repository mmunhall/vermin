var gpio = require("./node_modules/pi-gpio");

var LED_PIN                = 7,            // Pi pin number for LED circuit
    MONITOR_PIN            = 11,           // Pi pin number for monitor circuit
    MONITOR_LED_INTERVAL   = 2000,         // Number of milliseconds before LED blinks while monitoring trap
    TRIGGERED_LED_INTERVAL = 250,          // Number of milliseconds before LED blinks once trap is triggered.
    POLL_INTERVAL          = 1000,         // Number of milliseconds between polling the monitor circuit for its state
    LOW		           = 0,            // LED LOW
    HIGH	           = 1,            // LED HIGH
    currentState           = "monitoring", // One of "monitoring" or "triggered". Initialized to "monitoring" at startup. Could mutate when polling.
    executeIntervalId;                     // A handle on the setInterval() call.

module.exports = {
    start: function () {
    	init();
    	cycleLedHigh();
        executeIntervalId = setInterval(execute, POLL_INTERVAL);
    }
}

function init () {
    gpio.open(MONITOR_PIN, "input", function(err) { });
    gpio.open(LED_PIN, "output", function(err) { });
}

function tearDown() {
    gpio.close(MONITOR_PIN, function(err) { });
    gpio.close(LED_PIN, function(err) { });
}

function execute () {
    gpio.read(MONITOR_PIN, function(err, value) {
    	if (value === 0) {
            currentState = "triggered";
            notify();
            clearInterval(executeIntervalId);
        }
    });
}

function notify () {
    console.log("Trap shut! TODO: Send an email to me@example.com.");
}

function cycleLedHigh () {
    var interval = currentState === "monitoring" ? MONITOR_LED_INTERVAL : TRIGGERED_LED_INTERVAL;

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
