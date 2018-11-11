const http = require('http');

const req = http.request({
    hostname: 'www.google.com',
    method: 'GET',
}, res => {
    console.log(res.statusCode);
    console.log(res.headers);

    res.on('data', (data) => {
        console.log('Data ', data);
    })
});

req.on('error', err => {
    console.error(err);
});

req.end();