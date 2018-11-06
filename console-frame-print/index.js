/*
  For testing purposes,
  This blocks allows the framePrint function to be called with multiple arguments directly from a node Command Line Interface.
 */
/*if (process.argv.length > 2) {
  // Loop through the command line arguments
  process.argv.map((arg, index) => {
    switch (arg) {
      // Check if framePrint has been called
      case "framePrint":
        // Check if there are any arguments after the framePrint function to use as inputs
        if (process.argv.length >= (index + 1)) {
          // Get the number of string inputs
          let argNum = process.argv.length - (index + 1);
          // Loop through the string inputs
          for (let i = 1; i <= argNum; i++) {
            // Assign and pass each argument to the framePrint function
            let thisArg = process.argv[(index) + i];
              framePrint(thisArg);
          }
        }
        break;
      default:
        break;
    }
  });
}*/



// console.dir(Object.keys(exports));
// cli();
/*
  Logs the String input to the console, surrounded by a * frame of dynamic length.
 */
function framePrint(msg, log = false) {
  // Get msg length
  const length = msg.length;

  // Return error if no message is present
  if (length <= 0 || typeof msg !== 'string') {
    let err = length <= 0 ? "You've submitted an empty string as the function argument." : "You've submitted a function argument that is NOT an instance of String.";
    console.error(`Error: print-frame-display.printFrame(String) requires a valid, non-empty String as input. ${err}`);
    return;
  }

  let print = `
    ${'*'.repeat(length)}
    ${msg}
    ${'*'.repeat(length)}
    `;

  // Interpolate the msg and frame
  return log ? console.log(print) : print;
}
// Export the function
// module.exports = framePrint;
module.exports = framePrint;
require('../cli-run');