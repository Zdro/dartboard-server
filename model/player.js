var Round = require('./round.js');
var Game  = require('./game.js');

module.exports = class Player{
    constructor(game, playerName){
        this.name   = playerName;
        this.game   = game;
        this.rounds = new Array(new Round());
    }

    getCurrentRound(){
        return this.rounds[this.rounds.length - 1];
    }

    getRounds(){
        return this.rounds;
    }

    getScore() {
        return this.game.playerScore(this);
    }

    endRound(){
        this.rounds.push(new Round());
    }

    addDart(dart) {
        this.getCurrentRound().addDart(dart);
        if (this.game.roundIsComplete()) {
            this.endRound();
            return true;
        }
        return false;
    }

    isWinner(){
        return false;
    }

    toJSON(){
        var obj = {
            name : this.name,
            rounds : this.rounds,
            score : this.getScore(),
            isWinner : this.isWinner()
        }
       
        return  obj;
    }
}