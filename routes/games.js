var express = require('express');
var router = express.Router();

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

  console.log(req);

  res.redirect('/');
});


module.exports = router;