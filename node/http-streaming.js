class HttpsServer extends require('https').Server {
    constructor(port = 443) {
        super();
        this.port = port;
        return this.getKeyAndCert();
    }

    getKeyAndCert() {
        const fs = require('fs');
        const keyPath = "/home/drowsy/.ssh/https/https-streaming-key.pem", certPath = "/home/drowsy/.ssh/https/https-streaming-cert.pem";
        this.key = fs.readFileSync(keyPath, 'utf8');
        this.cert = fs.readFileSync(certPath, 'utf8');
        this.start();
    }

    start() {
        return this.HttpsServer = require('https')
            .createServer({
            key: this.key.toString(),
            cert: this.cert.toString(),
        })
            .on('request', (req, res) => {
                res.writeHead(200, {'content-type': 'text/plain'});
                res.end('Hello World\n');
            })
            .on('connection', () => console.log("User Connected"))
            .on('close', () => console.log("Server shutting down..."))
            .listen(this.port, () => console.log("Listening on port ", this.port));
    }

    static onRequest(req, res) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Hello World\n');
    }

    stop() {
        this.HttpsServer.close();
    }
}

// let Server = new HttpsServer();

// server: http.Server
const server = require('http').createServer();
server.on('request', (req, res) => {
    // req: http.IncomingMessage
    // res: http.ServerResponse
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('Hello World!\n');
});
server.listen(8000);