var Game = require('../game.js');

/* The Game_01 Class
 * This extends the Game class.  This class holds
 * all the rules for the x01 dart game variation.
 */

module.exports = class Game_Dummy extends Game{
    constructor(playerNames) {
        //Find the winning game score
        super(playerNames);
//        Game.apply(this, arguments);
    }
    isPlayerWinner(player) {
        return false;
    }
    playerScore(player) {
        var score = 0;
        player.getRounds().forEach(round => {
            round.getDarts().forEach(dart => {
                score += dart.getScore();
            });
        });
        return score;
    }
    roundIsComplete() {
        return this.currentPlayer().getCurrentRound().isComplete();
    }
}
