'use strict';

global.tryParseInt = function (a, base = 10) {
    try {
        var parsed = parseInt(a, base);
    } catch (e) {
        throw e;
    }
    if (isNaN(parsed))
        throw new TypeError(`Attempting to pass a value (${a.toString()}) to tryParseInt which cannot be parsed as a number`);
    else
        return parsed;
};

global.getCliPrompt = (inject = '') => process.stdout.write(`\u001B[2J\u001B[0;0f${inject}\n\>`);