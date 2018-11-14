const fs = require('fs'),
    path = require('path');

// let maxAge = 7; // in days

const isExpired = (path, callback = (err, isExpired) => { }) => {
    let expirationDate = new Date("Y-m-d H:m:s");
    expirationDate.setDate(expirationDate.getDate() - maxAge);
    fs.stat(path, (err, stat) => {
        if (err) callback(err, false);
        else callback(null, stat.birthtime <= expirationDate);
    });
};

/* Main() */

function cleanDir(targetPath, options = { extensions : [], maxAge : 7, maxATime : Math.ceil(this.maxAge / 2), includes : [] }) {
    options = Object.assign({}, { extensions : [], maxAge : 7, maxATime : Math.ceil(this.maxAge / 2), includes : [] }, options);
    let matchOptions = new RegExp(`^(${ options.includes.join("|") || '.*' })(${ options.extensions.join("|") || '.*' })$`);

    let targetFiles = [];
    try {
        fs.readdirSync(targetPath).forEach(file => {
            if (matchOptions.test(file.name)) targetFiles.push(file);
        });
    }
    catch (err) {
        switch (err.code) {
            case "EISDIR":
                console.error("The given directory (%s), does not exist", targetPath);
                break;
            default:
                throw err;
        }
    }


    if (targetFiles.length) {
        console.log("The following files will be deleted because they are older than %i days and haven't been accessed within %i days:\n", options.maxAge, options.maxATime, targetFiles.join("\n"), "\n");
        console.log("Are you sure you want to delete the listed files? (y/n): \n");
        process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
            if (chunk && chunk.toString().trim().toLowerCase().slice(0, 1) === 'y') {
                targetFiles.forEach(file => {
                    let filepath = path.resolve(targetPath, file.name);
                    // continue from here
                });
            }
            else {
                console.log("\nCancelling file-duster process");
                process.exit();
            }
        });
    }
    else console.log("No files will be deleted. Either none of the files in this directory matched your options, or file-duster encountered an error.");
}

/* End Main */