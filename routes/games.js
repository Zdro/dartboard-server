let express = require('express');
let router = express.Router();
let GameDummy = require('../model/gameVariants/GameDummy');

router.get('/', function (req, res, next) {  
  res.render('games/menu',{
    title: 'Game Menu',
  });
});

router.get('/new', function (req, res, next) {
  let gameRepository = req.app.gameRepository;
  let games = Object.keys(gameRepository.games);


  res.render('games/new', {
    title: 'New Game',
    games: games
  });
});

router.post('/new', function (req, res, next) {
  let playerNames = Array.isArray(req.body.playerName) ? req.body.playerName : new Array(req.body.playerName);
  let gameName = req.body.game;

  let Game = req.app.gameRepository.getGame(gameName);

  req.app.gameManager.startGame(new Game(playerNames));
  res.redirect('./play');

});

router.get('/play', function (req, res, next) {
  res.render('games/play', {
    title: 'Play !'
  });
});


module.exports = router;