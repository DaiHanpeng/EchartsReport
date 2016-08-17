var express = require('express');
var router = express.Router();
var data = require('../public/data.json');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send({"categories": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        "data": [5, 20, 36, 10, 10, 20]});
});

module.exports = router;