class instanceClass {
    constructor() {
        console.log("instanceClass constructor called");
    }

    static staticMethod() {
        console.log("instanceClass static method called");
    }
    instanceMethod() {
        console.log("instanceClass instance method called");
    }
}

class staticClass {
    static staticMethod() {
        console.log("staticClass explicit method called");
    }
}

class exportedInstanceClass {
    constructor() {
        console.log("exportedInstanceClass constructor called");
    }

    static staticMethod() {
        console.log("exportedInstanceClass static method called");
    }
    instanceMethod() {
        console.log("exportedInstanceClass instance method called");
    }
}

class exportedStaticClass {
    static explicitMethod() {
        console.log("exportedStaticClass explicit method called");
    }
    implicitMethod() {
        console.log("exportedStaticClass implicit method called");
    }
}

function topLevelExport() {
    console.log("Top level export called");
};
// module.exports = topLevelExport;

module.exports.namedExport = () => {
    console.log("Named export called");
};

function namedFunction() {
    console.log("Named function called");
}

const arrowFunction = () => {
    console.log("Arrow function called");
};

module.exports = arrowFunction;
module.exports.namedExport = namedFunction;
module.exports.exportedInstanceClass = exportedInstanceClass;
module.exports.exportedStaticClass = exportedStaticClass;

require('../');