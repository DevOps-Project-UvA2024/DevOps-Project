var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user/:userId', function(req, res, next) {
  var userId = req.params.userId;
  res.send(`User with id: ${userId}`);
});

module.exports = router;
