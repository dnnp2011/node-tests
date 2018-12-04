const dgram = require('dgram');

const port = process.env.PORT || 3333,
    host = '127.0.0.1';

// Server
const server = dgram.createSocket('udp4');
let connections = {};

server.on('listening', () => console.log('UDP server %s listening on port %s', host, port));

server.on('message', (msg, rinfo) => {
    let client = rinfo.address;
    if (!connections[client]) {
        let parsed = JSON.parse(msg.toString());
        connections[client] = {...parsed, done: false, collector: ''};
        console.log("%s added to connections", client);
        return;
    }
    console.log("Received '%s' from %s:%s", msg, rinfo.address, rinfo.port);
    let ref = connections[client];
    if (!ref.done) {
        ref.collector += msg;
        --ref.iterations;
        if (ref.collector === ref.result) {
            console.log("String construction complete: '%s' -- Iterations: ", ref.collector, ref.iterations);
            ref.done = true;
        }
        else {
            console.log("Waiting for more pieces. Current state: '%s'", ref.collector);
        }
    }
});

server.bind(port, host);

// Client
const client = dgram.createSocket('udp4');

const msg = Buffer.from("This is a very long string of data to send using udp packets!");

let pieces = 4;
let size = Math.ceil(msg.length / pieces);
let sent = 0,
    goal = msg.length;

let interval = setInterval(() => {
    if (sent >= goal) {
        clearInterval(interval);
        return;
    }
    let thisSize = (sent + size) > (msg.length) ? msg.length : (sent + size);
    client.send(msg, sent, thisSize, port, host, (err) => {
        if (err)
            console.error(err);
        else
            sent += thisSize;
    });
}, 1500);

let handshake  = Buffer.from(JSON.stringify({
    size: msg.length,
    iterations: pieces,
    delay: 1500,
    result: "This is a very long string of data to send using udp packets!"
}));
client.send(handshake, port, host, (err) => {
    if (err) throw err;
    console.log('UDP Packet Sent to %s on port %s', host, port);
    // client.close();
});
/*
setInterval(() => {
    client.send(msg, port, host, (err) => {
        if (err) throw err;
        console.log('UDP Packet Sent to %s on port %s', host, port);
        // client.close();
    });
}, 5000);*/
