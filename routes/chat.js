var express = require('express');
var router = express.Router();
var path = require('path');

module.exports = router;

router.get('/', function (req, res) {
  res.sendFile(path.resolve('files/chat.html'));
});

