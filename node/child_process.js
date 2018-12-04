const { spawn } = require('child_process');

// Print Working Directory
const pwd = spawn('pwd');
pwd.stdout.pipe(process.stdout);

// Read contents of a file
const { HOME } = process.env;
const head = spawn('head', [`${HOME}/.bashrc`]);
head.stdout.pipe(process.stdout);

// To call without separating arguments, enable shell boolean
// !! Only use if I have control over, or trust the source of the command string !!
const head2 = spawn(`head ${HOME}/.bashrc`, { shell: true });
head2.stdout.pipe(process.stdout);

// List files
const ls = spawn('ls', ['-l', '.']);
ls.stdout.pipe(process.stdout);

// Use Shell Syntax
const shell = spawn('ls -al ~ | wc -l', { shell: true });
shell.stdout.pipe(process.stdout);

// !! Debugging !!
// node --inspect-brk ./filepath.js