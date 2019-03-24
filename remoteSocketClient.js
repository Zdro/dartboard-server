let io = require('socket.io-client');

module.exports = class RemoteSocketClient{
    constructor(ip, gameManager, db){
        this.gameManager = gameManager;
        
        let that = this;
        let socket = io(ip);
        this.socket = socket;

               
        let conf = db.getCollection("dartboards").where(function (obj) {
            return (obj.ip == ip);
        });

        if (conf.length != 0) {
            
        }

        socket.on('connect', function(){
            that.gameManager.addClient(that);
            
            socket.on('hit', function(data){
                that.gameManager.handleHit(data);
            });
    
            socket.on('disconnect', function() {
                that.gameManager.removeClient(socket);
            });
        });
    }
    notifyChange(jsonData){
        this.socket.emit('game', jsonData);
    }
}