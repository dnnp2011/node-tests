const http = require('http');

const server = http.createServer((req, res) => {
    res.end(`<p style='color: orange;'>Hello World</p>`);
});

server.listen(4242, () => {
    console.log('Server is listening on port 4242...');
});