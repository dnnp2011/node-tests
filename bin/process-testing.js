
// VAL1=22 node ./bin/process-testing.js
// OR
// export VAL1=22
// node ./bin/process-testing.js
console.log(`Environment Variable: ${process.env.VAL1}`);


// node ./bin/process-testing.js "hello world" "goodbye world"
// Prints each argument
process.argv.map((arg, index) => {
  console.log(`Argument ${index}: ${arg}`);
});

// node -p "process.argv" hello 42
