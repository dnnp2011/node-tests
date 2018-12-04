process.argv.map((arg, index) => {
  switch (arg) {
    case 'echoCliInput':
      return echoCliInput();
    case 'pipeCliInput':
      return pipeCliInput();
  }
});

let once = false;

function echoCliInput() {
  console.log(__dirname);
  process.stdin.on('readable', () => {
    !once && process.stdout.write('Enter a word: ');
    once = true;
    const chunk = process.stdin.read();
    if (chunk !== null) {
      process.stdout.write(`\nYou Wrote: ${chunk}\n`);
      process.exit();
    }
  });
}

function pipeCliInput() {
  process.stdin.pipe(process.stdout);
}

process.on('exit', () => {
  console.log('Process is exiting...');
});