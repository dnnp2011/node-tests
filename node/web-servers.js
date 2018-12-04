'use strict';
const express = require('express'); // The top-level express object contains a Router object
const router = express.Router();
const path = require('path');
// const {numbers} = require('../drowsy-dev-helpers');
require('../drowsy-dev-helpers')();

const port = process.env.PORT || 4242;

const app = express();
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.all('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>Home Page</title>
    <meta lang='html' charset='utf-8' />
    <style>
    body {
    background: tomato;
    display: flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    justify-content: center;
    margin: auto;
    padding: 10px;
    }
    .content {
    margin: auto;
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    justify-content: center;
    }
    .content td {
    margin: auto;
    text-align: center;
    }
    </style>
    <body>
    <table class='content'>
    <tr><th><h3>Welcome to Drowsy's Web Server!</h3></th></tr>
    <tr><td><h4>This server is running on Express!</h4></td></tr>
</table>
</body>
</head>
</html>
    `).status(200);
});
app.use('/flights', router); // Delegate route to a separate Router instance

// Using wildcard variables in URL
router.all('*/:id', (req, res) => {
    const params = tryParseInt(req.params.id);
    res.status(200);
    if (params.between(0, 50))
        res.send('Between 0 and 50');
    else
        res.send('Greater than 50');
});

// Will pick up all routes that are not declared above
app.all('*', (req, res) => {
    res.status(404);
    res.render('error-404', {
        body: "File Not Found Error",
        url: req.url,
    });
});


app.listen(port, () => console.log('Express app is listening on port %i', port));

/* Built in http

const http = require('http');

const requestListener = (req, res) => {
    res.end('Hello World Goodbye\n');
};

// const app = http.createServer(requestListener); // createServer with request callback
const app = http.createServer(); // createServer with manual request listener subscription
app.on('request', requestListener);

app.listen(4242, () => {
    console.log('Server is listening on port 4242...');
});
*/
