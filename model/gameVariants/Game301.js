let Game = require('../game.js');
let Dart = require('../dart.js');

module.exports = class Game301 extends Game{
    constructor(playerNames) {
        super(playerNames);
        this.objective = {
            score : 301
        };
    }

    isPlayerWinner(player) {
        return player.getScore().score == this.objective.score
    }

    addDart(name, score, multiplier) {
        if (this.waitingForNextRound) return false;
        if (this.winnerIdx != undefined) return false;

        let dart = new Dart(name, score, multiplier);

        if (this.currentPlayer().getScore().score + dart.getScore() > this.objective.score){
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

            if (score + roundScore <= that.objective.score){
                score += roundScore;
            }
        });
        return {score : score};
    }
    roundIsComplete() {
        return this.currentPlayer().getCurrentRound().isComplete();
    }

    static getName(){
        return '301'
    };
}
