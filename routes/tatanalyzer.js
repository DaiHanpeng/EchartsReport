var express = require('express');
var router = express.Router();
var data = require('../public/data.json');
var db = require('../mysql/mysql')

function sendTatJson(response, tat){
    response.send(tat);
}

/* GET tat.json */
router.get('/', function (req, res, next) {
    console.log("trigger get tat analyzer");
    db.queryTatPerAnalyzers(null,null,sendTatJson, res);
});

/* POST tat.json */
router.post('/', function (req, res, next) {
    console.log(req.body);
    if (req.body) {
        db.queryTatPerAnalyzers(req.body.start, req.body.end, sendTatJson, res);
    }
});

module.exports = router;