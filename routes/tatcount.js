var express = require('express');
var router = express.Router();
//var data = require('../public/data.json');
var db = require('../mysql/mysql')

function sendTatJson(response,tat){
    response.send(tat);
}

/* GET tat.json */
router.get('/', function (req, res, next) {
    db.queryTatCount(null,null,sendTatJson, res);
});

/* POST tat.json */
router.post('/', function (req, res, next) {
    console.log(req.body);
    if (req.body) {
        db.queryTatCount(req.body.start, req.body.end, sendTatJson, res);
    }
});

module.exports = router;