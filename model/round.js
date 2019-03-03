var Dart = require('./dart.js');

module.exports = class Round {
    constructor(){
        this.darts = new Array();
        this.ended = false;
    }

    addDart(dart){
        if (this.isComplete)
            throw new Round.RoundException('This round is complete, can\'t add dart !');
        this.darts.push(dart);
        if (this.darts.length == 3)
            this.endRound();
    }

    endRound(){
        this.ended = true;
    }

    isComplete(){
        return this.ended;
    }

    static RoundException(msg) {
        this.message = msg;
        this.name = "RoundExcetpion";
    }
}