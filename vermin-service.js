var gpio = require("./node_modules/pi-gpio");
var mailService = require("./vermin-mailer.js");
var exec = require('child_process').exec;

var LED_PIN                = 7,            // Pi pin number for LED circuit
    MONITOR_PIN            = 11,           // Pi pin number for monitor circuit
    MONITOR_LED_INTERVAL   = 2000,         // Number of milliseconds before LED blinks while monitoring trap
    TRIGGERED_LED_INTERVAL = 250,          // Number of milliseconds before LED blinks once trap is triggered.
    POLL_INTERVAL          = 1000,         // Number of milliseconds between polling the monitor circuit for its state
    LOW                    = 0,            // LED LOW
    HIGH                   = 1,            // LED HIGH
    currentState           = "monitoring", // One of "monitoring" or "triggered". Initialized to "monitoring" at startup. Could mutate when polling.
    executeIntervalId,                     // A handle on the setInterval() call.
    options;                               // Runtime parameters (such as email info) specified by the user

module.exports = {
    start: function (optionsIn) {
        options = optionsIn;
    	setup();
        executeIntervalId = setInterval(execute, POLL_INTERVAL);
    },
    stop: function () {
        tearDown();
    }
}

// Opens the Pi input and output pins, starts the LED flashing.
function setup () {
    gpio.open(MONITOR_PIN, "input pulldown", function(err) { });
    gpio.open(LED_PIN, "output", function(err) { });

    // TODO: If the monitor pin is LOW, log to the console and exit. The pin must be high to start.

    cycleLedHigh();
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

// Reads the monitor pin. If the pin is low, currentState is changed to "triggered"
// and notifications are sent.
function execute () {
    gpio.read(MONITOR_PIN, function(err, value) {
	console.log(value);
    	if (value === LOW) {
            currentState = "triggered";
            notify();
            clearInterval(executeIntervalId);
        }
    });
}

// Currently, only sends an email message (if the email options were provided).
// In the future, notifiy() might also send SMS.
function notify () {
    var imagePath = "imgCapture/img_" + new Date().valueOf() + ".jpg";

    exec("raspistill -o " + imagePath, function () {
        if (options.emailTo) {
            mailService.sendMessage({
                to: options.emailTo,
                from: options.emailFrom,
                pass: options.emailPass,
                imagePath: imagePath
            });
        }
    });
}

// Sets the LED pin high and creates an interval to set the LED low in the future.
function cycleLedHigh () {
    var interval = currentState === "monitoring" ? MONITOR_LED_INTERVAL : TRIGGERED_LED_INTERVAL;

    setLed(HIGH, function () {
    	setTimeout(cycleLedLow, interval);
    });
}

// Sets the LED pin low  and creates an interval to set the LED high in the future.
function cycleLedLow () {
    setLed(LOW, function () {
    	setTimeout(cycleLedHigh, 250);
    });
}

// Sets the LED high or low, and executes an optional callback.
function setLed(value, callback) {
    gpio.write(LED_PIN, value, function(err) {
        if (callback) { callback(); }
    });
}
