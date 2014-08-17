var gpio = require("./node_modules/pi-gpio");
var mailService = require("./node_modules/vermin-mailer");

var LED_PIN                = 7,            // Pi pin number for LED circuit
    MONITOR_PIN            = 11,           // Pi pin number for monitor circuit
    MONITOR_LED_INTERVAL   = 2000,         // Number of milliseconds before LED blinks while monitoring trap
    TRIGGERED_LED_INTERVAL = 250,          // Number of milliseconds before LED blinks once trap is triggered.
    POLL_INTERVAL          = 1000,         // Number of milliseconds between polling the monitor circuit for its state
    LOW                    = 0,            // LED LOW
    HIGH                   = 1,            // LED HIGH
    currentState           = "monitoring", // One of "monitoring" or "triggered". Initialized to "monitoring" at startup. Could mutate when polling.
    executeIntervalId,                     // A handle on the setInterval() call.
    options,                               // Runtime parameters (such as email info) specified by the user

module.exports = {
    start: function (optionsIn) {
        options = optionsIn;
    	init();
    	cycleLedHigh();
        executeIntervalId = setInterval(execute, POLL_INTERVAL);
    },
    stop: function () {
        tearDown();
    }
}

function init () {
    gpio.open(MONITOR_PIN, "input", function(err) { });
    gpio.open(LED_PIN, "output", function(err) { });
}

/*
 * Gracefully closes all pins, turns off the LED, and ends the process.
 * Everything is performed in callbacks so that process.exit() can be called
 * after all actions have been performed.
 */
function tearDown() {
    setLed(LOW, function () {
    	gpio.close(MONITOR_PIN, function(err) {
    	    gpio.close(LED_PIN, function(err) {
    	        process.exit();
    	    });
        });
    });
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
    if (options.emailTo) {
        mailService.sendMessage({
            to: options.emailTo,
            from: options.emailFrom,
            pass: options.emailPass
        });
    }
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
    gpio.write(LED_PIN, value, function(err) {
        if (callback) { callback(); }
    });
}
