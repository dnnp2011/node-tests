
// const framePrint = require('console-print-frame');

/*module.exports = (function () {

})();*/

function parseArgv(rawArgs) {
    // 1, 2
    // Input: argv Output: Array of strings (without call overhead args) [arg1, arg2, arg3]
    // Throw soft exception if not enough argv's were specified
    if (rawArgs.length <= 2)
        throwSoftException("Not enough arguments given to run simulation", "parseArgv");
    // Remove default argv's from the array
    rawArgs.splice(0, 2);
    return rawArgs;
}

function groupFunctionCalls(parsedArgs, target) {


    // Identify what type of export it is: 1. Named Export 2. Named function (exported, class or top-level) 3. Class Instance and Function
    // 3, 4
    // Input: Array of strings [arg1, arg2, arg3] Output: Array of arrays grouping functions with their arguments [[func1, arg1, arg2], [func2, arg1, arg2]]

    let groupedArgs = [],
        funcCount = groupedArgs.length,
        funcRef = undefined;
    parsedArgs.forEach((arg, index) => {
        try {
            funcRef = target.__get__(arg);
            console.log(funcRef);
        }
        catch (err) {
            if (err instanceof ReferenceError) {
                if (funcCount <= 0) throwSoftException(`A valid function name must be given before its arguments, ${arg} is not a valid function name.`, "groupFunctionCalls");
                groupedArgs[funcCount - 1].push(arg);
                return;
            }
            else throw err;
        }

        if (funcRef) groupedArgs.push(new Array(funcRef));
        else console.log("Something went wrong with groupFuncCalls");

        funcCount = groupedArgs.length;
    });

    console.log("Grouped Args: %a", groupedArgs);

    return groupedArgs;
}

function prepareSimulations(groupedArgs) {
    // 5 (7)
    // Input: Array of arrays [[func1, arg1, arg2], [func2, arg1, arg2]] Output: Array of Simulation instances for each function call [Simulation{  }, Simulation{  }]
    return new SimulationCohort(groupedArgs);
}

function runSimulations(SimCohort) {
    // 6, 8
    // Input: Array of Simulation instances [Simulation{  }, Simulation{  }] Output: Async Promise. Resolves once all simulations are complete.
    SimCohort.Begin();
}

function showSimulationAnimation() {

}

function throwSoftException(msg, caller, exit = false) {
    console.error(`Error in ${caller}: ${msg}`);
    if (exit) process.exit();
}

function failsafe() {

}

class SimulationCohort {
    constructor(groupedArgs) {
        this.Cohort = {}; // A collection of groups
        this.Size = groupedArgs.length;
        groupedArgs.forEach((group, index) => {
            let [targetFunc, ...funcArgs] = group;
            this.Cohort[index] = new SimulationGroup(targetFunc, funcArgs);
        });
    }

    Begin() {
        this.Cohort.entries(([key, value]) => {
            console.log('Starting simulation for %s with params %s', value.Target.name, value.Args.join(', '));
            value.Begin();
        });
    }
}

class SimulationGroup {
    constructor(targetFunc, funcArgs, timeout = 5000, flags = {timeout: 5000, ctor: false}) {
        this.Group = []; // A Collection of simulations
        this.Target = targetFunc;
        this.Args = funcArgs;
        this.Flags = flags;
        // function.length does not count default arguments, TODO: Implement modifiers for functions (like setting number of default values or timeouts)
        this.ArgCount = targetFunc.length;
        this.Size = getSimulationCount(this.Args, this.ArgCount);

        for (let i = 0; i < this.Size; i++) {
            let simArgs = [];
            for (let n = 0; n < this.ArgCount; n++) {
                simArgs.push(this.Args[n + (i * this.ArgCount)]);
            }
            this.Group.push(new Simulation(this.Target, simArgs, this.Flags));
        }

        function getSimulationCount(args, requiredArgs) {
            let remainder = args % requiredArgs;
            if (remainder === 0) return args / requiredArgs;
            else {
                let droppedArgs = this.Args.splice(-(remainder), remainder);
                //TODO: Add instruction for explicit argument count modifier once implemented
                console.warn(`Number of arguments (${args.length}) provided for ${this.Target} does not allow for a whole number of invocations, given the number of required parameters (${requiredArgs}). As a result, the following arguments have been dropped 
from the simulation: [${droppedArgs.join(', ')}]. Double check your arguments, or consider providing an explicit parameter count if your function assigns default values to any parameters (these throw off the param count).`);
                return Math.floor(args / requiredArgs);
            }
        }
    }

    Begin() {
        //Start each simulation group
        this.Group.forEach(sim => sim.SimulateSync());
    }

    Stop() {
        //Stop each or one particular simulation group
    }

    CompileResults() {

    }

}

class Simulation {

    constructor(targetFunction, args, flags) {
        // Assign fields, generate metadata
        this.Target = targetFunction;
        this.Args = args;
        this.Born = moment();
        this.Id = Uuid.create();
        this.Simulating = false;
        this.Flags = Object.assign({}, {timeout: 5000, ctor: false}, flags);
    }

    toString() {
        return `Simulation ${this.Id.value}: Target Function = '${this.Target.name}', Function Parameters (${this.Target.length}) = '${this.Args.join(', ')}, Created = '${this.Born.format('L LTS')}', Age = '${this.Born.diff(moment(), 'seconds', true)}'`;
    }

    async Simulate() {
        // Fork the process, set kill timeout
    }

    SimulateSync() {
        this.Target.apply(...this.Args);
    }

    Die() {

    }

    PrepareResult() {
        // Crunch any numbers, parse any strings to format them
    }
}

module.exports = (function() {
    const rewire = require('rewire');
    const moment = require('moment');
    const uuid = require('uuid');
    moment().format();

    const hasMultiExports = (mainModule) => mainModule instanceof Object;

    let SimCohort;

    process.nextTick(function() {
        const target = rewire(this.process.mainModule.filename);
        const isClassInstantiated = (className, exports = null) => {
            if (exports && className) return typeof exports[className] === 'object';
            else if (className) return typeof className === 'object';
            else return console.error("isClassInstantiated has been used incorrectly. Should not be given both target and exports.");
        };

        const classHasProp = (classRef, propName) => Reflect.has(classRef, propName);

        const classPropNotPrimitive = (classRef, propName) => !isPrimitive(Reflect.get(classRef, propName));

        const isStaticMethod = (classRef, funcName) => !Reflect.has(Reflect.get(classRef, funcName), 'prototype');

        const classPropIsFunction = (classRef, propName) => typeof Reflect.get(classRef, propName) === 'function';

        //BUG: instanceClass comes up as Not Export when its top level export? Naming the export fixes.
        //BUG: namedExport comes up as Not Export, Not Ref, Not Number, Push to Args
        //BUG: All number string returns Not Export, Is Ref, Is Prim, Is Number. Should NOT be a reference.
        //BUG: Passing a Number causes error, valid case?
        //BUG: Passing decimal string cause Reflect.has called on non-object error
        //BUG: exportedStaticClass.explicitMethod of class ref export is correct. But switching to pre-instantiated class causes method not found error. Switching to non-static implicit method makes this work correctly.
        //BUG: Looking for an instance method of a named class export causes prop not found. (exportedInstanceClass.instanceMethod)
        //BUG: Instantiation the class export above allows the method to be found. Makes static method not return.
        //BUG: (instanceMethod) does not return a valid function without class at beginning
        filter("namedExport");

        function filter(input) {
            //TODO: Add support for methods nested iun classes: Class1.Class2.Class3.methodName
            /* Check if the input is a class method reference */
            let exported = this.process.mainModule.exports;
            if (input.includes('.')) {
                let [className, funcName] = input.split('.');
                className = className.trim().replace(/[^a-zA-Z0-9_\-]+/g, '');
                funcName = funcName.trim().replace(/[^a-zA-Z0-9_\-]+/g, '');
                /* Check if the class is an export */

                /* Check if class is Top-Level export */
                if (isTopLevelExport(input, exported)) {
                    if (!isPrimitive(exported)) {
                        if (isConstructable(exported)) {
                            /* Class is Pre-Instantiated Or Method is Static*/
                            if (isStaticMethod(exported, funcName) || isClassInstantiated(exported)) {
                                let funcRef = exported[funcName];
                                // !! Push method to new function group
                            }

                            /* The class has Not been Instantiated */
                            else {
                                // !! Push method to new function group with class instantiation flag
                            }
                        }
                        else {
                            throwSoftException(`The reference ${className} is not constructable. Check your reference.`, "filter");
                        }
                    }

                    /* Top-Level export ref is a primitive. Method does not exist. */
                    else {
                        // !! Class ref is actually a primitive
                        console.debug(`The class ${className} is actually a primitive, top-level export. Check your references.`);
                    }
                }

                /* Check if Named Export */
                else if (exported[className]) {
                    /* Check if the class is exported pre-instantiated */
                    if (isClassInstantiated(className, exported)) {
                        /* Check if the method exists in the class */
                        if (classPropIsFunction(exported[className], funcName)) {
                            let funcRef = exported[className][funcName];
                            // !! Push funcRef to new group
                            console.debug("Class Ref, Export, Pre-Instantiated, Typeof Function");
                        }
                        else {
                            console.debug(`Type of ${className}.${funcName} was ${typeof exported[className][funcName]}`);
                            throwSoftException(`The class ${className} exists, but its property ${funcName} is not a function.`, "filter");
                        }
                    }
                    else {
                        /* Check if the class can be instantiated */
                        let classRef = exported[className];
                        if (!isPrimitive(classRef)) {
                            /* The class reference is not a primitive */
                            if (isConstructable(classRef)) {
                                /* The class has a property called (funcName) */
                                if (classHasProp(classRef, funcName)) {
                                    /* The class method is not a primitive */
                                    if (classPropNotPrimitive(classRef, funcName)) {
                                        /* The Class Method is Static */
                                        if (isStaticMethod(classRef, funcName)) {
                                            let funcRef = classRef[funcName];
                                            // !! Valid static class method, push to new function group
                                        }
                                        else {
                                            // !! Valid class method, push to new function group with class instantiation flag
                                            console.debug(`Class Ref, Export, Not Instantiated, Typeof Function`);
                                        }
                                    }

                                    /* The class property (funcName) is actually a primitive property */
                                    else {
                                        // !! Treat as an arg, push to args of last function group
                                        console.debug(`The class ${className} exists, but the property ${funcName} is a primitive, not a function. It will be treated as a function argument instead.`);
                                    }
                                }
                                else {
                                    throwSoftException(`The class ${className} exists, but does not have a property called ${funcName}. Check your reference.`);
                                }
                            }
                            /* Invalid class reference, not constructable */
                            else {
                                throwSoftException(`The class ${className} cannot be instantiated. Check your spelling.`);
                            }
                        }

                        /* The class reference is actually a primitive */
                        else {
                            // !! Treat as an arg, push to args of last function group
                            console.debug(`The named export ${className} appears the be a primitive. It will be treated as an arg for last function group.`);
                        }
                    }
                }

                /* If not an export */
                else {
                    let classRef = undefined;
                    try {
                        classRef = target.__get__(className);
                    }
                    catch (e) {
                        if (e instanceof ReferenceError) classRef = null;
                        else throw e;
                    }

                    if (classRef) {
                        /* The Class Property Exists */
                        if (classHasProp(classRef, funcName)) {
                            if (classPropNotPrimitive(classRef, funcName)) {
                                /* The class is already instantiated, check for the method */
                                if (isClassInstantiated(classRef)) {
                                    //TODO: Do check on instantiated classes to see if function is static. Static functions don't have prototypes.
                                    let funcRef = classRef[funcName];
                                }
                                /* The class is not instantiated */
                                else {
                                    if (classHasProp(classRef, funcName)) {
                                        if (classPropNotPrimitive(classRef, funcName)) {
                                            if (isStaticMethod(classRef, funcName)) {
                                                let funcRef = classRef[funcName];
                                                // !! Push to new function group
                                                console.debug(`Class Ref, Not Export, Not Instantiated, Static Method`);
                                            }
                                            else {
                                                // !! Function exists, add to new group with class instantiation flag
                                                console.debug(`Class Ref, Not Export, Not Instantiated, Instance Method`);
                                            }
                                        }
                                        else {
                                            // !! Prop exists but is a primitive, add to args of last function group
                                            console.debug(`Class Ref, Not Export, Not Instantiated, Property Is A Primitive`);
                                        }
                                    }
                                    else {
                                        // !! Property does not exist, show error and drop arg
                                        console.debug(`Class Ref, Not Export, Not Instantiated, Property Invalid`);
                                        throwSoftException(`The class ${className} exists, but does not have a valid property called ${funcName}. Argument will be dropped.`);
                                    }
                                }
                            }

                            /* Class Property Exists But Is Primitive */
                            else {
                                // !! Property is a primitive, treat as argument
                                console.debug(`Class Ref, Not Export`);
                            }
                        }

                        /* The Class Property Does Not Exist */
                        else {
                            throwSoftException(`The class ${className} exists, but does not have a valid property called ${funcName}. Check your reference.`);
                        }
                    }

                    /* The left side is not a valid class. Treat it as a decimal input. */
                    else {
                        /* The left side of input is not a valid class and contains numbers. Treat as a decimal argument. */
                        if (/^[0-9.]+$/.test(input)) {
                            // !! Push parsed input to args of last function group
                            console.debug(`Input ${input} will be treated as a decimal`);
                        }

                        /* The left side of input is not a valid class and not a number, treat as an error */
                        else {
                            throwSoftException(`The class reference ${input} is not a valid class method, property, or decimal. Check your reference.`);
                        }
                    }
                }
            }

            /* If not a class method, must be a class ctor, function, or argument */
            else {
                let funcName = input.trim().replace(/[^a-zA-Z0-9_\-]+/g, '');
                /* If Top-Level Export */
                if (isTopLevelExport(funcName, exported)) {
                    /* Class is Pre-Instantiated */
                    if (isClassInstantiated(exported)) {
                        // !! Class is exported as instantiated object. Could either be an argument, or a ctor test to call again
                        console.debug(`The class ${funcName} is an instantiated top-level export. Not sure to treat this as an argument or a function to be instantiated again.`);
                    }

                    /* Class is Not Instantiated */
                    else {
                        // !! Push to new function group with class instantiation flag
                        console.debug(`IS Export, Is Top-Level Export, Not Instantiated Class, Push to new Function Group`);
                    }
                }

                /* If Named Export */
                else if (exported[funcName]) {
                    let funcRef = exported[funcName];
                    if (!isPrimitive(funcRef)) {
                        /* Named Class Export is Pre-Instantiated */
                        if (isClassInstantiated(funcRef)) {

                        }

                        /* Ref is a non-instantiated class ctor, or a constructable function */
                        else if (isConstructable(funcRef)) {
                            // !! Push to new function group with class instantiation flag
                            console.debug(`Is Export, Not Primitive, Is Constructable, Either Ctor or Function Ref`);
                        }

                        /* Ref is an anonymous function export or a arrow function */
                        else {
                            // !! Push to new function group
                            console.debug(`Is Export, Not Primitive, Not Constructable, Either Arrow Function or Anonymous Function`);
                        }
                    }

                    /* Export is a primitive, Treat as argument? */
                    else {
                        /* Is primitive, contains all digits, treat as parsed number */
                        if (/^[0-9.]+$/.test(funcName)) {
                            // !! Parse number and push as arg to last function group
                            console.debug(`Is Export, Is Primitive, IS Number, Push to Args`);
                        }

                        /* Is a primitive, but not a number. Treat as arg for last function group */
                        else {
                            // !! Push to args of last function group
                            console.debug(`Is Export, Is Primitive, Not Number, Push to Args`);
                        }
                    }
                }

                /* The function is not an export */
                else {
                    let funcRef = undefined;
                    try {
                        funcRef = target.__get__(funcName);
                    }
                    catch (e) {
                        /* The referenced function does not exist, show exception and drop */
                        if (e instanceof ReferenceError) {
                            if (/^[0-9.]+$/.test(funcName)) {
                                // !! Parse number and push as arg to last function group
                                console.debug(`Not Export, Not Reference, Is Number, Push to Args`);
                            }
                            else {
                                // !! Push to args of last function group
                                console.debug(`Not Export, Not Reference, Not Number, Push to Args`)
                            }
                        }
                        else throw e;
                    }

                    if (funcRef) {
                        if (!isPrimitive(funcRef)) {
                            /* Ref is a class ctor, or a constructable function */
                            if (isConstructable(funcRef)) {
                                // !! Push to new function group with class flag
                                console.debug(`Not Export, Is Reference, Not Primitive, Is Constructable, Push to new group with class instantiationg flag`);
                            }

                            /* Ref is an anonymous function export or a arrow function */
                            else {
                                // !! Push to new function group
                                console.debug(`Not Export, Is Reference, Not Primitive, Not Constructable, Push to new function group.`);
                            }
                        }

                        /* Reference is a primitive variable */
                        else {
                            // !! Push to args of last function group
                            if (/^[0-9.]+$/.test(funcRef)) {
                                // !! Parse number and push as arg to last function group
                                console.debug(`Not Export, Is Reference, Is Primitive, Is Number, Parse And Push to Args`);
                            }
                            else {
                                // !! Push to args of last function group
                                console.debug(`Not Export, Is Reference, Is Primitive, Not Number, Push to Args`)
                            }
                        }
                    }
                }
            }
        }

        function isTopLevelExport(funcName, exports) {
            return !!exports.name && exports.name === funcName;
        }

        function isConstructable(ref) {
            return !!ref.prototype && !!ref.prototype.constructor.name;
        }

        function isPrimitive (ref) {
            switch (typeof ref) {
                case 'number':
                case 'string':
                case 'boolean':
                    return true;
                default:
                    return false;
            }
        }

        /*
        1. Does it have a "."
        - a. True: It's a class method
        -- I. Split by the period
        -- II. Check exports for the class name
        --- >> Check if the class is already instantiated
        --- 1. It's an export
        ---- a. Instantiate the class, and check if the method exists
        ----- I. True: Method exists, push ref to new group
        ----- II. False: Method does not exist, throw soft exception and drop previous function group (Or give warning that the error could cause issues in simulation)
        --- 2. It's not an export
        ---- a. Does __get__ return anything?
        ----- I. True: It's a non exported class
        ------ 1. Instantiate the class, and check if the method exists
        ------- a. True: Method exists, push ref to new group
        ------- b. False: Method does not exist, throw soft exception and drop previous function group (Or give warning that the error could cause issues in simulation)
        ----- II. False: It's an argument, push to previous function or ctor
        ---- a. Is the Type a function, not a primitive?
        ----- I. True: Push the function ref to a new group
        ----- II. False: Throw soft exception stating the named reference is a primitive ( !! Throw out this group !! )

        - b. False: It's a class ctor, or a function
        -- I. Check exports for function name
        --- 1. It's in exports
        ---- a. Is the Type a function, not a primitive?
        ----- I. True: Try {} instantiating the function, does it throw an error? (TODO: Find alternative to figuring out ctor/func)
        ------ 1. ReferenceError: Class/Function does not exist
        ------- a. Its an arg, push to last function
        ------ 2. TypeError: It's not a class, it's a function (TODO: If I add support for named arg refs, do more processing here)
        ------- a. Push the function to a new group
        ------ 3. MissingParam: It's a class ctor
        ------- a. Push to new group, add CTOR flag
        ---- b. False: Its a primitive: Throw soft exception stating the named reference is a primitive ( !! Throw out this group !! )
        --- 2. It's not in exports
        ---- a. Does __get__ return anything?
        ----- I. True: It's a non-exported function, push function ref to new group
        ----- II. False: It's an argument, push to last function group

        OUTPUT: End result should be a callable Function reference, or a callable class constructor flagged

         */




/*        console.log(this.process.mainModule.exports['namedExport']()); // Named Function Export

        let temp = new this.process.mainModule.exports['exportedInstanceClass']();
        console.log(temp.instanceMethod()); // Instance Class Instance Method Export

        console.log(this.process.mainModule.exports['exportedStaticClass'].explicitMethod()); // Static Class Explicit/Implicit Method Export

        console.log(target.__get__('namedFunction')()); // Non-Exported Named Function

        temp = new (target.__get__('instanceClass'))();
        console.log(temp.instanceMethod()); // Non-Exported Named Instance Class Method

        console.log((target.__get__('staticClass')).staticMethod()); // Non-Exported Named Static Class Method*/


        process.on('exit', () => {
            console.log(("cli-run simulation complete"));
        });

        // runTests('instanceClass.instanceMethod');

        // runSimulations(prepareSimulations(groupFunctionCalls(parseArgv(process.argv), target)));


        /*
         1. Parse the cli argv input
         2. Break args into array
         3. Figure out which args are valid functions
         4. Split the valid functions and the args before the next valid function into their own arrays
         5. Iterate through the array of arrays, based on the number of required arguments, figure out how many iterations there should be for that function.
         6. Run each iteration, display error message if arg is not a valid argument for that function iteration
         7. !! Handle optional parameters. (Either determine of the number of args given is evenly divisible by the required arguments, or ask the use to provide stand-in args for them)
         8. Log each output to the console. Handle errors gracefully, by logging them but not failing entirely.
         9. Make the calling environment containerized so cli-run doesn't get stuck running loops in user functions.
         */
        // Simulation --> SimulationGroup --> SimulationCohort
    });
})();

/*module.exports = (function (){
    const funcs = Reflect.getOwnPropertyDescriptor(this, 0);
    const util = require('util'), fs = require('fs');
    const readFile = util.promisify(fs.readFile);
    const rewire = require('rewire');
    const Module = require('module');

    let myModule = new Module();



    //TODO: Wrap in a setImmediate function so that the file can be required at the top of a file but still have access to the loaded version. Run module.loaded to check
    //TODO: Handle non-exported functions
    //TODO: Make pieces more modular
    //TODO: Finish implementing planned functionality

    //TODO: Potential functionality:
    // Loop through all functions in parent, and call with randomly generated arguments (type checking)
    // Create common case testing modules for functions (to test common edge cases)
    process.nextTick(function() {
        const parent = rewire(this.process.mainModule.filename);

    });

    // Returns whether the mainModule is an Object. If yes, then there are multiple exports, if not, there is only one top-level export.
    const hasMultiExports = (mainModule) => mainModule instanceof Object;

    // Returns an iterable (array) of module exports from the requiring file
    const getExportsAsIterable = (mainModule) => {
        // process.main.exports
    };

    const main = this.process.mainModule.exports;
    if (process.argv.length > 2) {
        process.argv.forEach((arg, index, array) => {
            if (index <= 1)
                return;
            else {
                // console.log(Object.keys(this.process.mainModule.exports));
                // Checks if there is a single main function export, or multiple function exports
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
})();*/

/*
module.exports = ()=> {
    process.nextTick(function() {
        console.log(Reflect.getOwnPropertyDescriptor(module, 'exports').value);
    });
};*/
