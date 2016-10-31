var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res, next) {
  res.render('mt4');
});

router.get('/load/:fileName', function (req, res, next) {

  // Async respond
  fs.readFile("files/" + req.params.fileName, "utf8", function (err, data) {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    }

    // Set HTTP header
    // No caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0,
      'Content-type': 'text/plain'
    });

    var resultArray = data;
    res.send(resultArray);
  });

});

module.exports = router;
