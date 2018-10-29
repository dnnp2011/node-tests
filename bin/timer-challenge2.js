/**
 * Display 'Hello world'
 * Repeat (n) times
 * Then print 'DONE' and exit process
 * Constraint:
 * - Don't use setTimeout
 */

const delay = 1;
const iterations = 5;
count = 0;

const interval = setInterval(displayOrQuit, delay * 1000);

function displayOrQuit () {
  if (count >= iterations) {
    console.log('DONE...');
    clearInterval(interval);
  }
  else {
    console.log('Hello World');
  }
  ++count;
}