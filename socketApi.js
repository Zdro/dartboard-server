/*
var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}
*/

module.exports = function(io, app){
    io.on('connection', function(socket){
        console.log('A client connected');
        if (app.currentGame){
            app.currentGame.register(socket);
        }
                
        socket.on('hit', function(data){
            console.log('Socket Api - received hit : ' + data);
            app.handleHit(data);
        });

        socket.on('disconnect', function() {
            console.log('Got disconnect!');
            if (app.currentGame){
                app.currentGame.unregister(socket);
            }
        });
    });
}
/*
module.exports = socketApi;
*/