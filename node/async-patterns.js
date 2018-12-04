const fs = require('fs');
const util = require('util');



function read(file = __filename) {
    const data = fs.readFileSync(file);
    console.log('File data: %s', data);
}

function asyncCallbackCopy(file = __filename) {
    fs.readFile(file, function (err, data) {
        fs.writeFile(file + '_copy', data, function (err) {
            console.log('File %s copied', file);
        });
    });
}

async function asyncPromiseCopy(file = __filename) {
    const readFile = util.promisify(fs.readFile),
        writeFile = util.promisify(fs.writeFile);
    const data = await readFile(file);
    await writeFile(file + '_copy', data);
    console.log('File %s copied', file);
}

async function asyncPromisesCopy(file = __filename) {
    const { readFile, writeFile } = require('fs').promises;
    const data = await readFile(file);
    await writeFile(file + '_copy', data);
    console.log('File %s copied', file);
}

module.exports = {
    read,
    asyncCallbackCopy,
    asyncPromiseCopy,
    asyncPromisesCopy,
};

asyncPromisesCopy();