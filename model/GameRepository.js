module.exports = class GameRepository {
    constructor() {
        this.games = require('require-all')({
            dirname     :  __dirname + '/gameVariants',
            filter      :  /(Game.+)\.js$/,
            map         : function (name, path){
                let Game = require(path);
                return Game.getName();
            },
            recursive   : false
        });
    }

    getGame(name){
        return this.games[name];
    }
}