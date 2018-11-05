const EventEmitter = require('events');
require('../drowsy-dev-helpers').numbers();
require('../console-frame-print');
//TODO: Implement storage cache using Buffers and Alloc to save Store state
//TODO: Improve UI a bit using framePrint and additional string styling


class Server extends EventEmitter {
    constructor(client) {
        super();
        this.Store = new Store();
        // Wrap in nextTick() to avoid emitting a response before the listener subscribes to server
         process.nextTick(() => {
             this.emit('response', 'Submit a command (help to list commands)');
         });
        client.on('command', command => {
           this.commandSwitch(command);
        });
    }

    commandSwitch(input) {
        let parsed = input.split(' '),
            [command, ...args] = parsed;
        switch (command) {
            case 'add':
                if (!args.length) {
                    this.respond(`${command} => No tasks given`);
                    break;
                }
            case 'delete':
                if (!args.length) {
                    this.respond(`${command} => No tasks given`);
                    break;
                }
            case 'help':
            case 'ls':
                this[command](...args);
                break;
            default:
                this.error(command);
                break;
        }
    }

    help () {
        this.emit('response', 'help => ls (list stored tasks), add (add elements to the task store), delete (remove elements from the task store), help (list supported commands)');
    }

    add () {
        this.Store.add(...arguments);
        this.respond(`add => ${[...arguments].toString()}`);
    }

    ls () {
        let response = this.Store.isEmpty() ? 'Task Store is empty': this.Store.toString();
        this.respond(`ls => ${response}`);
    }

    delete (args) {
        if (arguments.length) {
            //TODO  separate args by numeric and string types (remove vs splice)
            // this.Store.remove(...arguments);
            // this.emit('response', `delete => ${[...arguments].toString()}`);
            this.respond(`delete => ${this.Store.remove(...arguments)}`);
        }
    }

    error(input) {
       this.respond(`Unknown Command ${input}`);
    }

    respond(msg) {
        this.emit('response', msg);
    }

}

class Store {
    constructor() {
        this.store = [...arguments];
    }

    toString() {
        let acc = '\n';
        this.store.forEach((item, index) => {
             acc += `Task ${index+1} ${item}\n`;
        });
        return acc;
    }

    isEmpty() {
        return this.store.length === 0;
    }

    add() {
        if (arguments.length)
            this.store.push(...arguments);
    }

    // Turn arguments into array of indices
    remove() {
        //TODO: Handle deleting multiples of the same string (by creating a validSearch array and removing previously added elements)
        if (arguments.length) {
            let spliceMap = [...arguments].map(item => {
                let parsed = parseInt(item);
                if (isNaN(parsed)) {
                    parsed = this.store.indexOf(item);
                }
                return parsed;
            });

            return this.splice(spliceMap);
        }
    }

    // Use index array from remove to splice them out
    splice(spliceMap) {
        let deleted = [];
        spliceMap.forEach(index => {
            if (index.between(0, this.store.length-1, true)) {
                deleted.push(this.store.splice(index, 1, null));
            }
        });

        this.store = this.store.filter(task => task !== null);
        return deleted.length ? deleted.toString() : 'No tasks could be removed';
    }

    shift() {
        return this.store.shift();
    }
}

module.exports = client => new Server(client);