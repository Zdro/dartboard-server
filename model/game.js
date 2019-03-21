let Dart   = require('./dart.js');
let Player = require('./player.js');

module.exports = class Game {
    constructor(playerNames) {
        this.players = new Array();
        this.currentPlayerIdx = 0;
        this.round = 1;
        this.winnerIdx = undefined;
        //this.updateView = function () { };
        this.waitingForNextRound = false;
        this.clients = [];

        let that = this;
        
        for (let i = 0; i < playerNames.length; i++) {
            const playerName = playerNames[i];
            that.players.push(new Player(that, playerName));
            
        }
    }

    addDart(name, score, multiplier) {
        if (this.waitingForNextRound) return false;
        if (this.winnerIdx != undefined) return false;

        let dart = new Dart(name, score, multiplier);
        let wasEndOfRound = this.currentPlayer().addDart(dart);
        
        if (this.currentPlayer().isWinner()) {
            this.winnerIdx = this.currentPlayerIdx;
        }
        if (wasEndOfRound) {
            this.stopRound();
        }
        this.updateView();
    }
    currentPlayer() {
        return this.players[this.currentPlayerIdx];
    }
    nextPlayer() {
        this.currentPlayerIdx++;
        if (this.currentPlayerIdx >= this.players.length) {
            this.currentPlayerIdx = 0;
            this.round++;
        }
    }
    playerScoreByIndex(index) {
        let player = this.players[index];
        return this.playerScore(player);
    }
    currentPlayerName() {
        return this.currentPlayer().playerName;
    }
    stopRound(){
        this.currentPlayer().endRound();
        this.nextPlayer();
        this.waitingForNextRound = true;
    }
    startRound(){
        this.waitingForNextRound = false;
        this.updateView();
    }
    /* You must override these methods in the game variation class. */
    // All player is winner checks call this method.
    currentPlayerIsWiner() {return false;}
    // All score checks call this method.
    playerScore(player) {return 0;}

    updateView() {
        this.clients.forEach(element => {
            element.notifyChange();
        });      
    }

    register(client){
        this.clients.push(client);
        this.updateView();
    }

    unregister(client){
        let i = this.clients.indexOf(client);
        this.clients.splice(i, 1);
    }

    toJSON(){
        let obj = {
            players : this.players,
            currentPlayerIdx : this.currentPlayerIdx,
            round : this.round,
            winnerIdx : this.winnerIdx,
            waitingForNextRound : this.waitingForNextRound,
            objective : this.objective,
            name : this.getGameName()
        }        
        return obj;
    }
}