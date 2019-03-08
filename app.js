var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var loki = require('lokijs');
var util = require('util');

var indexRouter = require('./routes/index');
var remoteDartboardRouter = require('./routes/dartboards');
var remoteGamesRouter = require('./routes/games');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dartboards', remoteDartboardRouter);
app.use('/games', remoteGamesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.dartboardConnections = [];
app.currentGame = undefined;

app.handleHit = function(data){
  console.log('handleHit : ' + data); 
  if (app.currentGame){
    var isDartRegEx = RegExp('((s|d)25)|((s|d|t)(1[0-9]|20|[1-9]))');
    if (isDartRegEx.test(data)){
      var name = data;
      var value = parseInt(data.substr(1));
      var multiplier;
      if (data.substr(0,1) == 's') multiplier = 1
      else if (data.substr(0,1) == 'd') multiplier = 2
      else if (data.substr(0,1) == 't') multiplier = 3
      
      app.currentGame.addDart(name, value, multiplier);
    }
    else if (data === 'stop_round'){
      app.currentGame.stopRound();
    }
    else if (data === 'start_round'){
      app.currentGame.startRound();
    }
  }

}

var db = new loki('dartboard.db', {
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true, 
	autosaveInterval: 4000
});

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
  var dartboards = db.getCollection("dartboards");
  if (dartboards === null) {
    dartboards = db.addCollection('dartboards', { indices: ['ip'] });;
  }

  var games = db.getCollection("games");

  if (games === null) {
    games = db.addCollection('games');
    games.on('insert', function(input) { input.id = input.$loki; });
  }
  
  app.db = db;
}

module.exports = app;
