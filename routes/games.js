var express = require('express');
var router = express.Router();
var Game = require('../model/game.js');
var Game01 = require('../model/gameVariants/game_01.js');

router.get('/', function (req, res, next) {  
  res.render('games/menu',{
    title: 'Game Menu',
  });
});

router.get('/new', function (req, res, next) {
  res.render('games/new', {
    title: 'New Game'
  });
});

router.post('/new', function (req, res, next) {
  var db = req.app.db;
  var games = db.getCollection("games");

  var playerNames = Array.isArray(req.body.playerName) ? req.body.playerName : new Array(req.body.playerName);
  req.app.currentGame = new Game01(playerNames, 3);

  res.redirect('./play');
});

router.get('/play', function (req, res, next) {
  res.render('games/play', {
    title: 'Play !'
  });
});


module.exports = router;