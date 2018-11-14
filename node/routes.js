const server = require('http').createServer(),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    querystring = require('querystring');


const apiData = {
    1: {
        name: 'dalton',
        age: 25,
        sex: 'm',
        height: '5\'10"',
        weight: '160',
    },
    2: {
        name: 'sarah',
        age: 22,
        sex: 'f',
        height: '5\'5"',
        weight: '120',
    },
    3: {
        name: 'lorie',
        age: 43,
        sex: 'f',
        height: '5\'4"',
        weight: '100',
    },
    4: {
        name: 'amber',
        age: 27,
        sex: 'f',
        height: '5\'6"',
        weight: '150',
    },
    5: {
        name: 'nick',
        age: 38,
        sex: 'm',
        height: '5\'11"',
        weight: '200',
    }
};


server.on('request', (req, res) => {
    /* Parse URL Manually */
    // let parsed = req.url.replace(/[^a-zA-Z0-9\-_]+/g, ''),
    //     localUri = `./public/${parsed}.html`;

    /* Parse with URL Utility */
    let parsed = url.parse(req.url),
        fileView = path.resolve(__dirname, `public${parsed.pathname}.html`);
    console.log(parsed, '\n', fileView);

    /* Example of QueryString and Formatting Url */
    if (parsed.query) {
        let query = {};
        query.query = querystring.parse(parsed.query);
        query.query.rel = "relativePath";
        query.query.breed = "Boxer";
        query.query.name = "Segan Pierce";
        query.hostname = "www.pluralsight.com";
        query.pathname = "/watch/nodejs/";
        query.hash = "ad4tq38y908incqefq";
        query.protocol = "https:";
        console.log("Parsed Query: ", query.query);

        query.search = querystring.stringify(query.query);
        console.log("Stringified Query: ", query.search);

        let parsedUrl = url.format(query);
        console.log("Stringified Url Obj: ", parsedUrl);
    }

    /* Handle Routing */
    switch (parsed.pathname) {
        case '/':
            res.writeHead(301, "Permanent Move", { 'Location': '/home' });
            res.end();
            break;
        case '/home':
            res.writeHead(200, "OK", {'content-type': 'text/html'});
            res.end(fs.readFileSync(fileView));
            break;
        case '/api':
            res.writeHead(200, "OK", {'content-type': 'application/json'});
            res.end(JSON.stringify(apiData));
            break;
        default:
            res.writeHead(404, "Not Found", {'content-type': 'text/plain'});
            res.end(`Page '${req.url.replace(/[^a-zA-Z0-9\-_]+/g, '')}' could not be found (error 404)\n`);
            break;
    }
});

server.listen(8000, () => console.log("Listening on port 8000"));