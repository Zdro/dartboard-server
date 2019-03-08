var Dart   = require('./dart.js');
var Round  = require('./round.js');
var Player = require('./player.js');

module.exports = class Game {
    constructor(playerNames) {
        this.players = new Array();
        this.currentPlayerIdx = 0;
        this.round = 1;
        this.winnerIdx = undefined;
        //this.updateView = function () { };
        this.waitingForNextRound = false;
        this.dartboards = [];

        var that = this;
        
        for (let i = 0; i < playerNames.length; i++) {
            const playerName = playerNames[i];
            that.players.push(new Player(that, playerName));
            
        }
    }

    addDart(name, score, multiplier) {
        if (this.waitingForNextRound) return false;

        var dart = new Dart(name, score, multiplier);
        var wasEndOfRound = this.currentPlayer().addDart(dart);
        
        if (this.currentPlayer().isWinner()) {
            this.winnerIdx = this.currentPlayerIdx;
            this.updateView();
    
            return true;
        }
        if (wasEndOfRound) {
            this.stopRound();
        }
        this.updateView();

        return false;
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
        var player = this.players[index];
        return this.playerScore(player);
    }
    currentPlayerName() {
        return this.currentPlayer().playerName;
    }
    stopRound(){
        this.currentPlayer.currentRound
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
        var that = this;
        console.log('Updating view ...');
        //console.log(JSON.stringify(that));
        var jsonGame = JSON.stringify(that);

        console.log('emmiting to ' + this.dartboards.length + ' clients');
        this.dartboards.forEach(element => {
            element.emit('game', JSON.stringify(that));
        });      
    }

    register(socket){
        console.log('registering client');
        this.dartboards.push(socket);
        this.updateView();
    }

    unregister(socket){
        var i = this.dartboards.indexOf(socket);
        this.dartboards.splice(i, 1);
    }

    toJSON(){
        var obj = {
            players : this.players,
            currentPlayerIdx : this.currentPlayerIdx,
            round : this.round,
            winnerIdx : this.winnerIdx,
            waitingForNextRound : this.waitingForNextRound
        }
        
        return obj;
    }

}

// A callback method called after the game adds the new dart
//Game.prototype.updateView = function() { /*empty*/ }
