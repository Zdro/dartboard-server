module.exports = class localSocketClient{
    constructor(io, gameManager){
        this.io = io;
        this.gameManager = gameManager;
        let that = this;
        
        io.on('connection', function(socket){
            that.gameManager.addClient(that);
            that.socket = socket

            that.socket.on('hit', function(data){
                that.gameManager.handleHit(data);
            });
    
            that.socket.on('disconnect', function() {
                that.gameManager.removeClient(socket);
            });
        });
    }
    notifyChange(jsonData){
        this.io.emit('game', jsonData);
    }
}
