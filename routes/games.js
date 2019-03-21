let express = require('express');
let router = express.Router();
const { check, oneOf, validationResult } = require('express-validator/check');

router.get('/', function (req, res, next) {  
  res.render('games/menu',{
    title: 'Game Menu',
  });
});

router.get('/new', function (req, res, next) {
  let gameRepository = req.app.gameRepository;
  let games = Object.keys(gameRepository.games);

  let errors = req.session.errors
  req.session.errors = null;
  res.render('games/new', {
    errors: errors,
    title: 'New Game',
    games: games
  });  

  
});

router.post('/new', [
  check('playerName').exists().withMessage('Player(s) must be added'),
  oneOf([
    check('playerName')
      .isArray()
      .custom((values) => {
        let result = true;
        values.forEach(value => {
          if (value !== escape(value)) result = false;
        })
        return result;
      }),
    check('playerName')
      .isString()
      .custom((value) => value === escape(value)),
      check('playerName').not().exists()
  ], 'Special characters are not allowed in player name'),
  oneOf([
    check('playerName')
      .isArray()
      .custom((values) => {
        let result = true;
        values.forEach(value => {
          if (value === '') result = false;
        })
        return result;
      }),
    check('playerName')
      .isString()
      .custom((value) => value !== ''),
    check('playerName').not().exists()
  ], 'Player name can not be blank'),
  check('game')
    .exists()
    .custom((value, {req}) => {
      return req.app.gameRepository.getGame(value) != undefined
    })
    .withMessage('Please select a valid game')
], function (req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    req.session.errors = errors.array();
    req.session.success = false;
    
    res.redirect('/games/new');
    return false;
  }
  
  let playerNames = Array.isArray(req.body.playerName) ? req.body.playerName : new Array(req.body.playerName);
  let gameName = req.body.game;

  let Game = req.app.gameRepository.getGame(gameName);

  req.app.gameManager.startGame(new Game(playerNames));
  req.session.success = true;
  res.redirect('./play');
});

router.get('/play', function (req, res, next) {

//  let Game = req.app.gameRepository.getGame('GameCricketCutThroat');
//  req.app.gameManager.startGame(new Game(['Zdro', 'Maïté', 'Thomas', 'Seb']));


  res.render('games/play', {
    title: 'Play !'
  });
});


module.exports = router;