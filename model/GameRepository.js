module.exports = class GameRepository {
    constructor() {
        this.games = require('require-all')({
            dirname     :  __dirname + '/gameVariants',
            filter      :  /(Game.+)\.js$/,
            recursive   : false
        });

        console.log(this.games);
    }

    getGame(name){
        return this.games[name];
    }
}