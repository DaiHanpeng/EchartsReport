var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('boxplotanalyzer', { title: 'box plot analyzer' });
});

module.exports = router;
