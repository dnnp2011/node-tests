const https = require('https');

// req: http.ClientRequest
function doReq() {
    const req = https.request({
        hostname: 'www.google.com',
        method: 'GET',
    }, res => {
        // res: http.IncomingMessage
        console.log(res.statusCode);
        console.log(res.headers);

        /* Returns a Buffer */
        res.on('data', (data) => {
            console.log('Google: ', data);
        });
    });
    req.on('error', err => {
        console.error(err);
    });
    console.log(req.agent);
    req.end();
}

/* Done using the global HTTP Agent */
const get = https.get("https://www.duckduckgo.com", res => {
    res.on('data', data => console.log('DuckDuckGo: ', data.toString()));
});
// agent: http.Agent
console.log(get.agent);

