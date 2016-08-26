var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('boxplottime', { title: 'box plot time' });
});

module.exports = router;
