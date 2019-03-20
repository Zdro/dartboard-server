let Round = require('./round.js');
//let Game  = require('./game.js');

module.exports = class Player{
    constructor(game, playerName){
        this.name   = playerName;
        this.game   = game;
        this.rounds = new Array(new Round());
    }

    getName(){
        return this.name;
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
        this.getCurrentRound().endRound();
        this.rounds.push(new Round());
    }

    addDart(dart) {
        this.getCurrentRound().addDart(dart);
        if (this.game.roundIsComplete()) {
            return true;
        }
        return false;
    }

    isWinner(){
        return this.game.isPlayerWinner(this);
    }

    toJSON(){
        let obj = {
            name : this.name,
            rounds : this.rounds,
            score : this.getScore(),
            isWinner : this.isWinner()
        }
       
        return  obj;
    }
}