
var mysql = require("mysql");
var queues = require('mysql-queues');
var fs = require('fs');
//var JSON = require('json');

var dbConfig = require("./mysql.json");
var tatDefinition = require("./TatByMinutes.json");


//connection interface.
function getConnection() {
    var connection = mysql.createConnection({
        host : dbConfig["dbHost"],
        port : dbConfig["dbPort"],
        user : dbConfig["uName"],
        password : dbConfig["uPwd"],
        database : dbConfig["dbName"],
        charset : 'UTF8_GENERAL_CI',
        debug : false
    });
    
    queues(connection, true);
    connection.connect();
    
    return connection;
}

//query tat count
function queryTatCount(startDate, endDate, callback, func) {
    var queryString = "SELECT COUNT(*) as count FROM tat WHERE tat > ? AND tat < ?";
    var conn = getConnection();
    var low = 0;
    var high = 0;
    var tat = [];
    
    if (startDate && endDate) {
        queryString += " AND las_inlab > '" + startDate + "' AND las_inlab < '" + endDate + "'";
    }
    
    for (var index = 0; index < tatDefinition["minutes"].length; index++) {
        //define low and high for different ranges.
        if (index < tatDefinition["minutes"].length - 1) {
            low = tatDefinition["minutes"][index];
            high = tatDefinition["minutes"][index + 1];
        } else if (index = tatDefinition["minutes"].length - 1) {
            low = tatDefinition["minutes"][index];
            high = low + 10;//set high limit
        }
        
        //
        conn.query(queryString, [low, high], function (err, rows, fields) {
            if (err) {
                throw err;
                var o = { code: 1, msg: "error during quering mysql database!" };
                res.end(JSON.stringify(o));
                
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                row = rows[0];
                tat.push(row.count);
                console.log('get count from [' + low + ',' + high + ']:' + row.count);
            }
            
            if (tat.length == tatDefinition["minutes"].length) {
                tatDefinition["tat"] = tat;                
                callback && callback(func, tatDefinition);
            }
            
        });
    }
    
    return tatDefinition;
}

function callbackMySqlDone(func, tat) {
    func(tat);
}

function displayTat(tat) {
    console.log(tat);
}

/////////////////////////////////////////////////////////////////////////////////////

//query tat data per analyzer type
function queryTatCount(startDate, endDate, callback, func) {
    var queryString = "SELECT COUNT(*) as count FROM tat WHERE tat > ? AND tat < ?";
    var conn = getConnection();
    var low = 0;
    var high = 0;
    var tat = [];
    
    if (startDate && endDate) {
        queryString += " AND las_inlab > '" + startDate + "' AND las_inlab < '" + endDate + "'";
    }
    
    for (var index = 0; index < tatDefinition["minutes"].length; index++) {
        //define low and high for different ranges.
        if (index < tatDefinition["minutes"].length - 1) {
            low = tatDefinition["minutes"][index];
            high = tatDefinition["minutes"][index + 1];
        } else if (index = tatDefinition["minutes"].length - 1) {
            low = tatDefinition["minutes"][index];
            high = low + 10;//set high limit
        }
        
        //
        conn.query(queryString, [low, high], function (err, rows, fields) {
            if (err) {
                throw err;
                var o = { code: 1, msg: "error during quering mysql database!" };
                res.end(JSON.stringify(o));
                
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                row = rows[0];
                tat.push(row.count);
                console.log('get count from [' + low + ',' + high + ']:' + row.count);
            }
            
            if (tat.length == tatDefinition["minutes"].length) {
                tatDefinition["tat"] = tat;
                callback && callback(func, tatDefinition);
            }
            
        });
    }
    
    return tatDefinition;
}

//queryTatCount(null,null,callbackMySqlDone,displayTat);
exports.queryTatCount = queryTatCount;
