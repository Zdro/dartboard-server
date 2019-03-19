module.exports = class GameManager{    
    constructor(){
        this.currentGame = null;
        this.clients = new Array();
    }
    addClient(client){
        this.clients.push(client);
        this.notifyChange();
    }
    removeClient(client){
        let index = this.clients.indexOf(client);
        this.clients.splice(index, 1);
    }
    notifyChange(){
        let jsonGame = JSON.stringify(this.currentGame);
        this.clients.forEach(client => {
            client.notifyChange(jsonGame);
        });   
    }
    startGame(game){
        this.currentGame = game;
        this.currentGame.register(this);
    }

    handleHit(data){
        if (this.currentGame){
          let isDartRegEx = RegExp('((s|d)25)|((s|d|t)(1[0-9]|20|[1-9]))');
          if (isDartRegEx.test(data)){
            let name = data;
            let value = parseInt(data.substr(1));
            let multiplier;
            if (data.substr(0,1) == 's') multiplier = 1
            else if (data.substr(0,1) == 'd') multiplier = 2
            else if (data.substr(0,1) == 't') multiplier = 3
            
            this.currentGame.addDart(name, value, multiplier);
          }
          else if (data === 'stop_round'){
            this.currentGame.stopRound();
          }
          else if (data === 'start_round'){
            this.currentGame.startRound();
          }
        }
    }
}