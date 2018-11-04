/* Individual Exports */
module.exports.numbers = (function () {
    require('./prototypes/Number');
})();
//BUG: These individual exports don't seem to import properly
module.exports.helpers = (function () {
    require('./helpers/index');
})();

/* Top Level Export */
module.exports = (function () {
    require('./prototypes/Number');
    require('./helpers/index');
})();