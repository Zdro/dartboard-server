let GameCricket = require('./GameCricket.js');
let Dart = require('../dart.js');

module.exports = class GameCricketCutThroat extends GameCricket{
    constructor(playerNames) {
        super(playerNames);
    }

    hasPlayerClosedSegment(player, segmentIdx){
        return this.scores[player.getName()].segments[segmentIdx] == 3;
    }

    updatePlayerScore(dart){
        if (this.isDartInObjective(dart)){
            let segmentIdx = this.objective.segments.indexOf(dart.getValue());

            for (let i = 1; i <= dart.getMultiplier(); i++){
                /* if current player hasn't closed segment yet */
                if (this.scores[this.currentPlayer().getName()].segments[segmentIdx] < 3){
                    this.scores[this.currentPlayer().getName()].segments[segmentIdx]++;
                }
                /* checking if player can score*/
                else{
                    let that = this;
                    let otherPlayers = this.players.filter((player) => {
                        return player != that.currentPlayer();
                    });
                    
                    otherPlayers.forEach(player => {
                        if (! that.hasPlayerClosedSegment(player, segmentIdx)){
                            that.scores[player.getName()].score += dart.getValue();
                        }
                    });
                }
            }
        }
    }
    isPlayerWinner(player) {
        if (this.scores[player.getName()].segments.every(segment => {return segment == 3})){
            let that = this;

            let otherPlayers = this.players.filter(p => {
                return player != p;
            });

            let result = true
            otherPlayers.forEach(p => {
                if (that.scores[p.getName()].score < that.scores[player.getName()].score){
                    result = false;
                }
            })
            return result;
        }
        return false;
    }   
    playerScore(player) {
        return this.scores[player.getName()];
    }
    roundIsComplete() {
        return this.currentPlayer().getCurrentRound().isComplete();
    }

    static getName(){
        return 'Cricket Cut Throat';
    }
}
