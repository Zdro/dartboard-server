import Round from './round.js';
import Game from './game.js';

export default class Player{
    constructor(game, playerName){
        this.name   = playerName;
        this.game   = game;
        this.rounds = new Array(new Round());
    }
}