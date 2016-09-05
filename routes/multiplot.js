var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('multiplot', { title: 'tat multi plot' });
});

module.exports = router;
