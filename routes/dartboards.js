var express = require('express');
var router = express.Router();
var ioClient = require('socket.io-client');


/* GET users listing. */
router.get('/', function (req, res, next) {
  var db = req.app.db;
  var dartboards = db.getCollection("dartboards");

  var results = dartboards.find();
  
  res.render('dartboards', {
    title: 'Dartboard Configuration',
    dartboards : results
  });
});

router.post('/new', function (req, res, next) {
  var db = req.app.db;
  var dartboards = db.getCollection("dartboards");

  var name = req.body.name;
  var ip = req.body.ip;

  var results = dartboards.where(function (obj) {
    return (obj.ip == ip);
  });

  if (results.length == 0) {
    dartboards.insert({
      name: name,
      ip  : ip
    });
  }

  res.redirect('/dartboards');
});

router.post('/delete', function (req, res, next) {
  var db = req.app.db;
  var dartboards = db.getCollection("dartboards");

  var ip = req.body.ip;
  dartboards.findAndRemove({ip: ip});
  res.redirect('/dartboards');
});

router.post('/connect', function (req, res, next) {
  var ip = req.body.ip;
  var alreadyConnected = 
  req.app.dartboardConnections.filter(
    elem => elem.name == ip
  ).length > 0 ;

  if (!alreadyConnected){
 
    var socket = ioClient(ip);
    
    socket.on('connect', function(){
      var that = this;
      var controler = {
        name : that.io.uri,
        socket : that
      }
      req.app.dartboardConnections.push(controler);
    });

    socket.on('hit', function(data){
      req.app.handleHit(data);
    });
  }
  
  res.redirect('/dartboards'); 
});

module.exports = router;