## Description
A npm package that allows node module functions to be tested from the command line. By using cli-run, you can call your module's functions by name, provide arguments for that function, call multiple functions with their arguments, or provide multiple arguments for the same function to be called successively.

## Installation
Add the NPM package to your project as a development dependency by running:
> ```npm i --save-dev cli-run```

## Functionality
* Call functions (both classic functions and arrow functions) contained in the module (Javascript file) from the command line
* Provide arguments for the called function
* Call multiple functions with their arguments from the command line
* Call functions multiple times by providing arguments for each successive run

## Import
To use cli-run functionality, simply require the module's top-level self-invoking function **after your module.exports**:

>```require('cli-run');```

## Usage
> Calling a function: 

```node ./myNodeFile.js myFunction argument1 argument2```

> Calling multiple functions: 

```node ./myNodeFile.js func1 arg1 arg2 func2 arg1```

> Calling a function multiple times (Where func1 takes 1 arg): 

```node ./myNodeFile.js myFunction1 run1Arg1 run2Arg1 run3Arg1```

> Calling multiple functions multiple times (where func1 takes 1 arg and func2 takes 2 args):

```node ./myNodeFile.js func1 run1Arg1 run2Arg1 run3Arg1 func2 run1Arg1 run1Arg2 run2Arg1 run2Arg2```

By using cli-run, you avoid having to declare argv handling for every file every time you want to test it, or constantly adding console.logs for every test case.

## Author
>**DrowsyDev**