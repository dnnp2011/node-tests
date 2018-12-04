const EventEmitter = require('events');
const util = require('util');

const emitter = new EventEmitter();

const setImmediatePromise = util.promisify(setImmediate);
setImmediatePromise(emitter.emit('TEST_EVENT')).then(() => {
    console.log('.then activated');
});

(async function() {
        await setImmediatePromise(emitter.emit('TEST_EVENT'));
        console.log('Promise fulfilled');
    }
)();
emitter.on('TEST_EVENT', (event) => {
     console.log('TEST_EVENT fired %s', event);
});

emitter.emit('TEST_EVENT');
