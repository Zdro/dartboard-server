let Game = require('../game.js');
let Dart = require('../dart.js');

module.exports = class Game301 extends Game{
    constructor(playerNames) {
        super(playerNames);
        this.objective = 301;
        console.log('game 301 started')
    }

    isPlayerWinner(player) {
        return player.getScore() == this.objective
    }

    addDart(name, score, multiplier) {
        if (this.waitingForNextRound) return false;
        if (this.winnerIdx != undefined) return false;

        let dart = new Dart(name, score, multiplier);

        if (this.currentPlayer().getScore() + dart.getScore() > this.objective){
            this.currentPlayer().addDart(dart);
            this.stopRound();
            this.updateView();
            return false;
        }

        return super.addDart(name, score, multiplier);
    }
    
    playerScore(player) {
        let score = 0;
        let that = this;
        player.getRounds().forEach(round => {
            let roundScore = 0;
            round.getDarts().forEach(dart => {
                roundScore += dart.getScore();
            });

            if (score + roundScore <= that.objective){
                score += roundScore;
            }
        });
        return score;
    }
    roundIsComplete() {
        return this.currentPlayer().getCurrentRound().isComplete();
    }
}
