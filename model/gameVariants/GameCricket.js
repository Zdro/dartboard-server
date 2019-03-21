let Game = require('../game.js');
let Dart = require('../dart.js');

module.exports = class GameCricket extends Game{
    constructor(playerNames) {
        super(playerNames);
        let that = this;
        this.scores = new Array();

        this.objective = {
            score    : 0,
            segments :[20,19,18,17,16,15,25]
        };

        playerNames.forEach((playerName, i) => {
            that.scores[playerName] = {
                score     : 0,
                segments : [0,0,0,0,0,0,0]
            }
        });
    }

    addDart(name, score, multiplier) {
        if (this.waitingForNextRound) return false;
        if (this.winnerIdx != undefined) return false;

        let dart = new Dart(name, score, multiplier);
        let wasEndOfRound = this.currentPlayer().addDart(dart);
        
        this.updatePlayerScore(dart);

        if (this.currentPlayer().isWinner()) {
            this.winnerIdx = this.currentPlayerIdx;
        }
        if (wasEndOfRound) {
            this.stopRound();
        }
        this.updateView();
    }

    isDartInObjective(dart){
        return this.objective.segments.includes(dart.getValue());
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
                    let everyoneClosedSegment = true;
                    otherPlayers.forEach(player => {
                        if (! that.hasPlayerClosedSegment(player, segmentIdx)){
                            everyoneClosedSegment = false;
                        }
                    });
                    if (!everyoneClosedSegment){
                        this.scores[this.currentPlayer().getName()].score += dart.getValue();
                    }
                }
            }
        }
    }
    isPlayerWinner(player) {
        if (this.scores[player.getName()].segments.every(segment => {return segment == 3})){
            let otherPlayers = this.players.filter(p => {
                return player != p;
            });
            let that = this;
            let result = true
            otherPlayers.forEach(p => {
                if (that.scores[p.getName()].score > that.scores[player.getName()].score){
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
        return 'Cricket';
    }
}
