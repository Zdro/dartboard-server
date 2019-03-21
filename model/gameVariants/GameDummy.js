let Game = require('../game.js');

module.exports = class GameDummy extends Game{
    constructor(playerNames) {
        super(playerNames);
    }
    isPlayerWinner(player) {
        return false;
    }
    playerScore(player) {
        let score = 0;
        player.getRounds().forEach(round => {
            round.getDarts().forEach(dart => {
                score += dart.getScore();
            });
        });
        return {score : score};
    }
    roundIsComplete() {
        return this.currentPlayer().getCurrentRound().isComplete();
    }

    getGameName(){
        return 'Dummy';
    }

    static getName(){
        return 'Dummy';
    }
}
