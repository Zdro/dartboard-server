let express = require('express');
let router = express.Router();
let RemoteSocketClient = require('../remoteSocketClient');

/* GET users listing. */
router.get('/', function (req, res, next) {
  let db = req.app.db;
  let dartboards = db.getCollection("dartboards");

  let results = dartboards.find();
  
  res.render('dartboards', {
    title: 'Dartboard Configuration',
    dartboards : results
  });
});

router.post('/new', function (req, res, next) {
  let db = req.app.db;
  let dartboards = db.getCollection("dartboards");

  let name = req.body.name;
  let ip = req.body.ip;

  let results = dartboards.where(function (obj) {
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
  let db = req.app.db;
  let dartboards = db.getCollection("dartboards");

  let ip = req.body.ip;
  dartboards.findAndRemove({ip: ip});
  res.redirect('/dartboards');
});

router.post('/connect', function (req, res, next) {
  let ip = req.body.ip;
  
  let client = new RemoteSocketClient(ip, req.app.gameManager, req.app.db);
  
  res.redirect('/dartboards'); 
});

module.exports = router;