const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const loki = require('lokijs');

const indexRouter = require('./routes/index');
const remoteDartboardRouter = require('./routes/dartboards');
const remoteGamesRouter = require('./routes/games');

const app = express();
const GameManager = require('./gameManager');
app.gameManager = new GameManager();

const GameRepository = require('./model/GameRepository');
app.gameRepository = new GameRepository();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'zdro-dartboard-server', saveUninitialized: false, resave: false}));

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

let db = new loki('dartboard.db', {
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true, 
	autosaveInterval: 4000
});

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
  let dartboards = db.getCollection("dartboards");
  if (dartboards === null) {
    dartboards = db.addCollection('dartboards', { indices: ['ip'] });;
  }

  let games = db.getCollection("games");

  if (games === null) {
    games = db.addCollection('games');
    games.on('insert', function(input) { input.id = input.$loki; });
  }
  
  app.db = db;
}

module.exports = app;
