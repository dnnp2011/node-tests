module.exports = (function (){
    const funcs = Reflect.getOwnPropertyDescriptor(this, 0);
    const util = require('util'), fs = require('fs');
    const readFile = util.promisify(fs.readFile);

    //TODO: Handle non-exported functions
    //TODO: Make pieces more modular
    //TODO: Finish implementing planned functionality

    //TODO: Potential functionality:
    // Loop through all functions in parent, and call with randomly generated arguments (type checking)
    // Create common case testing modules for functions (to test common edge cases)

    const main = this.process.mainModule.exports;
    if (process.argv.length > 2) {
        process.argv.forEach((arg, index, array) => {
            if (index <= 1)
                return;
            else {
                // console.log(Object.keys(this.process.mainModule.exports));
                if (main instanceof Object) {
                    if (main.name === arg) {
                        const requiredArgs = main.length;
                        const remainder = process.argv.length - (index + 1);
                        if (remainder < requiredArgs)
                            console.warn('Error: The function identified as %s requires %i arguments, you provided none.', main.name, requiredArgs);
                        else if (remainder > requiredArgs) {
                            //TODO Handler for uneven number of arguments for multi-call
                            for (let i = 1; i <= remainder; i++) {
                                let argument = process.argv.slice(index+1+(i-1), index+1+i);
                                console.log('Obj: Calling %s with argument %s', main.name, argument.toString());
                                main(...argument);
                            }
                        }
                        else {
                            let arguments = process.argv.slice(index+1, process.argv.length);
                            console.log('Obj: Calling %s with arguments %s', main.name, arguments.toString());
                            main(...arguments);
                        }
                    }
                    else {
                        //TODO: Create take (n) from args function to take next arg set (where n is func.length)
                        Object.values(main).map((value, index, array) => {
                            // BUG: This path doesn't properly multi-call with extra arguments
                            if (value instanceof Function && value.name === arg) {
                                const requiredArgs = value.length;
                                const remainder = process.argv.length - (index + 1);
                                if (remainder < requiredArgs)
                                    console.warn('Error: The function identified as %s requires %i arguments, you provided none.', main.name, requiredArgs);
                                else if (remainder > requiredArgs) {
                                    //TODO Handler for uneven number of arguments for multi-call
                                    for (let i = 1; i <= remainder; i++) {
                                        let argument = process.argv.slice(index+1+(i-1), index+1+i);
                                        console.log('Obj: Calling %s with argument %s', value.name, argument.toString());
                                        value(...argument);
                                    }
                                }
                                else {
                                    let arguments = process.argv.slice(index+1, process.argv.length);
                                    console.log('Obj: Calling %s with arguments %s', value.name, ...arguments.toString());
                                    value(...arguments);
                                }
                            }
                        });
                    }
                }
                else {
                    if (main.name === arg) {
                        const requiredArgs = main.length;
                        const remainder = process.argv.length - (index + 1);
                        if (requiredArgs !== remainder)
                            console.warn('Error: The function identified as %s requires %i arguments, you only provided %i', main.name, requiredArgs, remainder);
                        let arguments = process.argv.slice(index+1, process.argv.length);
                        console.log('Func: Calling %s with arguments %s', main.name, ...arguments.toString());
                        main(...arguments);
                    }
                }
            }
        });
    }
})();