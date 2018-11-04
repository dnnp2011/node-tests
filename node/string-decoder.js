const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

// StringDecoder will remember the incomplete bytes of a stream and attempt to complete them with sequential bytes. toString will only decode the bytes it has available in that chunk.

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk != null) {
        const buffer = Buffer.from([chunk]);
        console.log('With .toString(): ', buffer.toString());
        console.log('With StringDecoder: ', decoder.write(buffer));
    }
});