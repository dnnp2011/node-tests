require('../drowsy-dev-helpers').helpers();
const framePrint = require('../console-frame-print');
writeCliPrompt();

const net = require('net');
const server = net.createServer();

const port = process.env.PORT || 4242;
let counter = 0;
let connections = {};

server.on('connection', socket => {
    socket.setEncoding('utf8');
    socket.id = counter++;
    const client = socket.address();
    client.id = counter;

    connections[counter] = {
        ...client,
        socket,
    };
    console.log('Client connected: ');
    console.dir(connections[counter], {depth: 0}, );
    socket.write(getCliPrompt(framePrint('Welcome to SockChat!'), 'Enter your session username:'));

    socket.on('data', data => handleData(socket, client, data.trim()));
    socket.on('end', hadError => handleEnd(hadError, socket, client));
});

function handleData (socket, client, data) {
    let { command, args } = parse(data);
    if (!connections[client.id].username) {
        setUsername(command, client);
    }
    else {
        serverLog(client, `cmd => ${command} arguments => ${args || 'none'}`);
        switch (command) {
            case 'help':
                socket.write(`help => Valid commands are 'ls' list available users, 'm/[username or id] <message>' to send message to a user, 'b/ <message>' to broadcast message to all users, 'id/[username]' to get the ID associated with a username, 'help' to view available commands.`);
                break;
            case 'ls':
                socket.write(getClientList());
                break;
            default:
                if (command.startsWith('m/', 0)) {
                    let target = command.split('/')[1];
                    messageUser(target, client.id, args);
                }
                else if (command.startsWith('b/', 0)) {
                    broadcast(client.id, args);
                }
                else if (command.startsWith('id/', 0)) {
                    let target = command.split('/')[1],
                        uid = getUserId(target);
                    console.log('Target: %s UID: %s Args: %s', target, uid, args);
                    socket.write(uid ? `ID of ${target} is (${uid})` : `Could not find ID for ${target}. Ensure the user is online, and that their username is spelled correctly.`);
                }
                else {
                    socket.write(`Command ${command} not recognized!`);
                }
        }
        waitForInput(socket);
    }
}

function setUsername(name, client) {
    const isValidUsername = name => !getUserId(name);
    let alphaNum = /^[a-zA-Z0-9]*$/, oneLetter = /[a-zA-Z]+/;
    if (isValidUsername(name) && alphaNum.test(name) && oneLetter.test(name)) {
        connections[client.id].username = name;
        serverLog(client, `Session username set to ${name}`);
        connections[client.id].socket.write(`Your username for this session is ${connections[client.id].username}. Enter a command, or help to view commands.`);
        broadcast(client.id, `${name} has joined this room!`);
    }
    else {
        connections[client.id].socket.write(`The username ${name} is taken or is invalid. Valid usernames must contain all alphanumeric characters and at least 1 letter.`);
    }
    waitForInput(connections[client.id].socket);
}

function messageUser(identifier, sender, msg) {
    let sent = false;
    if (isNaN(parseInt(identifier)))
        identifier = getUserId(identifier);
    for (let [key, value] of Object.entries(connections)) {
        if (key === identifier) {
            value.socket.write(`${getUsername(sender)} (private): ${msg}`);
            value.socket.write(getCliLine());
            sent = true;
            break;
        }
    }
    if (!sent) {
        connections[sender].socket.write(`You -> (${getUsername(identifier)}): Message failed... Check that user is online and identifier is correct.`);
    }
    else {
        connections[sender].socket.write(`You -> (${getUsername(identifier)}): ${msg}`);
    }
}

function broadcast(sender, msg) {
    if (Object.keys(connections).length === 1 && !Object.keys(connections).includes(sender)) {
        connections[sender].socket.write(`\nYou -> (${Object.keys(connections).length - 1} clients): No clients online to receive your message!`);
        return;
    }
    else if (Object.keys(connections).length === 0) {
        return;
    }
    Object.entries(connections).forEach(([key, value]) => {
        let socket = value.socket;
        if (value.id !== sender) {
            socket.write(`\n${getUsername(sender)} (broadcast): ${msg}`);
            socket.write(getCliLine());
        }
    });
    connections[sender].socket.write(`\nYou -> (${Object.keys(connections).length - 1} clients): ${msg}`);
}

function getUserId(username) {
    let id;

    for (let [key, value] of Object.entries(connections)) {
        if (value.username === username) {
            id = key;
            break;
        }
    }
    return id;
}

const getUsername = (id) => connections[id].username;

function handleEnd(hadError, socket, client) {
    if (hadError)
        console.log("Client disconnected with error: ");
    else
        console.log("Client disconnected: ");

    let username = getUsername(client.id);
    console.dir(connections[client.id], {depth: 0});
    delete connections[client.id];
    broadcast(client.id, `${username} has left this room.`);

}

function serverLog(client, msg, details = {}) {
    console.log("Client %s (%s): %s ", client.id, connections[client.id].username, msg, details);
}

function parse(data) {
    let args = data.split(' '),
        command = args.splice(0, 1)[0];
    args = args.join(' ');
    return {
        command,
        args
    };
}

function waitForInput(socket) {
    socket.write(getCliLine());
}

function getClientList() {
    let clients = [];

    Object.entries(connections).forEach(([key, value]) => {
        clients.push([key, value.username]);
    });

    return clients.reduce((acc, currentValue) => {
        let id = currentValue[0],
            username = currentValue[1];
        acc += `Id: ${id} Username: ${username}\n`;
        return acc;
    }, '');
}

server.on('close', () => {
    console.log('Shutting Down...');
});

process.on('exit', () => {
    console.log('Process Terminating...');
});

server.listen(port, () => console.log('   Server listening on port %i', port));