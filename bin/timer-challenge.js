/**
 * Display 'Hello after (n * delay) seconds'
 * Repeat (n) times
 * Constraint:
 * - Use only one function
 */

const delay = 1;

function displayRecursively (iterations, message = null, count = 1) {
  if (message)
    console.log(message);

  if (count <= iterations) {
    return setTimeout(displayRecursively, delay * count * 1000, iterations, `Hello after ${delay * count} seconds`, ++count);
  }
  else {
    return console.log('DONE...');
  }
}

displayRecursively(4);