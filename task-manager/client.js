const EventEmitter = require('events');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new EventEmitter();
const server = require('./server')(client);
server.on('response', response => {
    process.stdout.write('\u001B[2J\u001B[0;0f');
    process.stdout.write(response);
    process.stdout.write('\n\>');
});

rl.on('line', input => {
    // Every time client reads a line, it will emit the data to the server
    client.emit('command', input);
});