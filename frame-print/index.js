module.exports = function framePrint (msg) {
    // Get msg length
    const length = msg.length;

    // Return error if no message is present
    if (length <= 0 || typeof msg !== 'string') {
        let err = length <= 0 ? "You've submitted an empty string as the function argument." : "You've submitted a function argument that is NOT an instance of String.";
        console.error(`Error: print-frame-display.printFrame(String) requires a valid, non-empty String as input. ${err}`);
        return;
    }

    // Build the frame based on msg length
    let border = '';
    for (let i = 0; i < length; i++) {
        border += '*';
    }

    // Interpolate the msg and frame
    console.log(`
    ${border}\n
    ${msg}\n
    ${border}\n
    `);
};