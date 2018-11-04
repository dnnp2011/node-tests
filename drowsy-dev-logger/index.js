const EventEmitter = require('events');
const fs = require('fs');



/*class DevLogger {
    subscribers = [];

    constructor(subscriber, logFilePath = DefaultLogFile) {
        const newSubscriber = new PromEventEmitter();
        this.subscribe(newSubscriber);
        return newSubscriber;
    }

    subscribe(subscriber) {
        subscriber.on(EVENT)
        .then((event) => {
            console.log("Event: ", event);
        })
        .catch(err => {
            console.error("Error: ", err);
        });
        this.subscribers.push(subscriber);
    }

    release(subscriber) {
        this.subscribers.forEach(instance => {
            if (instance instanceof subscriber) {
                subscriber.removeListener(EVENT, instance);
            }
        });
    }

    async logData(data, logFile,callback) {

    }
}*/

class DevLogger extends EventEmitter {
    constructor() {
        const DefaultLogPath = `${process.env.HOME}/logs`;
        let pieces = require.main.filename.split('/');
        super();
        this.fileName = pieces[pieces.length -1];
        const DefaultLogFile = `${DefaultLogPath}/${this.fileName}_log.txt`;
        this.EVENT = "EVENT_LOG";
        this.filePath = DefaultLogPath;
        this.logFile = DefaultLogFile;
        return this.newsubscriber();
    }

    newsubscriber() {
        const newSubscriber = new EventEmitter();
        newSubscriber.on(this.EVENT, (event, callback = () => {}) => {
            this.log(event).then(() => callback());
        });
        return newSubscriber;
    }

    async log(data, callback = () => {}) {
        let date = new Date();
        let dateFormat = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let headerStamp = `=> ${dateFormat} (${this.fileName}):`;
        data = `\n${headerStamp}
        ${data}\n`;
        return new Promise((async (resolve, reject) => {
            try {
                await fs.stat(this.filePath, async (err, stats) => {
                    if (err) {
                        await fs.mkdir(this.filePath, (err) => {
                            console.error(err);
                        });
                    }

                    await fs.appendFile(this.logFile, data, callback);
                    resolve(callback());
                });
            }
            catch (e) {
                reject(e);
            }
        }));

        /*fs.stat("/home/drowsy/logs").then((stats) => {
            console.log("Dir found: ", stats);
        })
            .catch(err => {
                console.warn("Error: ", err);
            });
*/
        /*await fs.stat(this.filePath).catch(async err => {
            console.warn("File path does not exist: ", err);
            await fs.mkdir(this.filePath)
            .then(() => {
                console.log("Directory Made");
            })
            .catch(err => {
                console.error(err);
            });
        });*/

        /*fs.appendFile('home/drowsy/logs/string-decoder_log.txt', data)
          .then(() => {
              callback();
          })
          .catch(err => {
              console.error(err);
          });*/
    }

    //TODO: Reevaluate these methods
    setPath(path) {
        this.filePath = path;
    }

    setFile(file) {
        this.logFile = this.filePath + '/' + file;
    }
}

module.exports = DevLogger;