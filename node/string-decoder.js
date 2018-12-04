const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const DevLogger = require('../drowsy-dev-logger');

// StringDecoder will remember the incomplete bytes of a stream and attempt to complete them with sequential bytes. toString will only decode the bytes it has available in that chunk.

const Logger = new DevLogger();
Logger.emit("EVENT_LOG", "This is my write data", () => {
    console.log("Data done writing");
});

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk != null) {
        const buffer = Buffer.from([chunk]);
        console.log('With .toString(): ', buffer.toString());
        console.log('With StringDecoder: ', decoder.write(buffer));
    }
});