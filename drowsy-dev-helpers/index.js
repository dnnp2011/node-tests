// TODO: Refactor this to not require invoking the module to use its functionality

const numbers = (() => {
    require('./prototypes/Number');
});

const helpers = (() => {
    require('./helpers/index');
});

const main = (() => {
    numbers();
    helpers();
});

module.exports = main;
module.exports.helpers = helpers;
module.exports.numbers = numbers;