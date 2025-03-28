var express = require('express');
var router = express.Router();

/* Kezdo oldal */
router.get('/', function(req, res, next) {
  res.send('Backend szerver fut');
});

module.exports = router;
