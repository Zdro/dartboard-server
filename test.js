const WebSocket = require('ws');

// create webSocket server for incoming connections on port 9000
const wServer = new WebSocket.Server({port: 80});

const wClient = new WebSocket('ws://www.somehost.com', {});

wClient.on('open', () => {
    console.log("connected to other client");
});

wClient.on('error, err => {
    console.log("client error", err);
});

// server event handlers
wServer.on('listening', () => {
    console.log("server started");
});

wServer.on('connection', ws => {
    // forward all incoming messages to the other server
    ws.on('message', msg => {
        wClient.send(msg);
    });
});

wSserver.on('error', err => {
    console.log("server error", err);
});