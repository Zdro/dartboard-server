//let io = require('socket.io-client');
const WebSocket = require('ws');

module.exports = class WebSocketClient{
    constructor(ip, gameManager, db){
        this.gameManager = gameManager;
        
        let that = this;

       let ws = new WebSocket('ws://' + ip);
       
       ws.on('message', function(data) {
            that.gameManager.handleHit(that.translate(data));
       });
    }

    translate(msg){
        msg = msg.replace(/[^0-9,]/g, '');
        let conf = {"0,2":"d17","0,3":"s17","0,4":"t17","0,5":"t2","0,6":"s2","0,7":"d2","1,0":"d5","1,1":"d20","1,2":"d19","1,3":"s19","1,4":"t19","1,5":"t10","1,6":"s10","1,7":"d10","2,0":"d12","2,1":"d9","2,2":"d3","2,3":"s3","2,4":"t3","2,5":"t15","2,6":"s15","2,7":"d15","3,0":"s5","3,1":"s20","3,2":"d7","3,3":"s7","3,4":"t7","3,5":"t6","3,6":"s6","3,7":"d6","4,0":"t5","4,1":"t20","4,2":"d16","4,3":"s16","4,4":"t16","4,5":"t13","4,6":"s13","4,7":"d13","5,0":"t12","5,1":"t9","5,2":"d8","5,3":"s8","5,4":"t8","5,5":"t4","5,6":"s4","5,7":"d4","6,0":"d25","6,1":"s25","6,2":"d11","6,3":"s11","6,4":"t11","6,5":"t18","6,6":"s18","6,7":"d18","7,0":"s12","7,1":"s9","7,2":"d14","7,3":"s14","7,4":"t14","7,5":"t1","7,6":"s1","7,7":"d1"};
        return conf[msg];
    }
    notifyChange(jsonData){
        //this.socket.emit('game', jsonData);
    }
}