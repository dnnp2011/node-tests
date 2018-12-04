// Import my NPM package
const framePrint = require('../console-frame-print');
const DevLogger = require('../drowsy-dev-logger');

const logger = new DevLogger();

framePrint('NPM Is Awesome!');

logger.emit("EVENT_LOG", "Printed 'NPM Is Awesome!' to console")
/*
    Expected Output:

    ***************
    NPM Is Awesome!
    ***************
 */