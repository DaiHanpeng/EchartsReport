
var mysql = require("mysql");
var queues = require('mysql-queues');
var fs = require('fs');
//var JSON = require('json');

var dbConfig = require("./mysql.json");
var tatDefinition = require("./TatByMinutes.json");
var multiplotDefinition = require("./TatMultiPlot.json")

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

//////////////////////////////////////////////////////////////////////////////////////////
//query tat count
//////////////////////////////////////////////////////////////////////////////////////////
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

function callbackMySqlCountDone(func, tat) {
    func(tat);
}

function displayTat(tat) {
    console.log(tat);
}

/////////////////////////////////////////////////////////////////////////////////////
//query tat data per analyzer type
/////////////////////////////////////////////////////////////////////////////////////
function queryTatPerAnalyzers(startDate, endDate, callback, func) {
    var queryString = "SELECT tat FROM tat WHERE tat > 0 AND tat < 200";
    var conn = getConnection();
    var analyzer_types = ["advia2400", "centaur", "both"];

    var queryResults = [];
    var count = 0;

    if (startDate && endDate) {
        queryString += " AND las_inlab > '" + startDate + "' AND las_inlab < '" + endDate + "'";
    }
      
    for (var index = 0; index < analyzer_types.length; index++) {
        var mysqlQuery = "";
        
        mysqlQuery = queryString + " AND analyzer_type = '" + analyzer_types[index] + "'";
        //console.log("query string: \n" + mysqlQuery);
        conn.query(mysqlQuery, [], function (err, rows, fields) {
            if (err) {
                throw err;
                
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                var result = [];
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    result.push(Number(row.tat));
                }
                
                queryResults.push(result);
                
                //console.log("analyzer type: " + analyzer_types[count++]);
                //console.log(result.length);
            }
            
            if (queryResults.length == analyzer_types.length) {
                tatDefinition["tatByAnalyzer"]["advia2400"] = queryResults[0];
                tatDefinition["tatByAnalyzer"]["centaur"] = queryResults[1];
                tatDefinition["tatByAnalyzer"]["both"] = queryResults[2];
                callback && callback(func, tatDefinition);
                //console.log(queryResults);
            }
        });
    }
    
    return queryResults;
}

function callbackMySqlAnalyzerDone(func, tat) {
    func(tat);
}

function displayAnalyzerTat(tat) {
    analyzers = ["advia2400", "centaur", "both"];
    for (var i = 0; i < tat.length; i++) {
        console.log("analyzer: " + analyzers[i]);
        console.log(tat[i].length);
    }
}

///////////////////////////////////////////////////////////////////////////////////
//query tat per morning/noon/afternoon
///////////////////////////////////////////////////////////////////////////////////
function queryTatPerTimes(startDate, endDate, callback, func) {
    var queryString = "SELECT tat FROM tat WHERE tat > 0 AND tat < 200";
    var conn = getConnection();
    var time_types = ["morning", "noon", "afternoon"];
    
    var queryResults = [];
    var count = 0;
    
    if (startDate && endDate) {
        queryString += " AND las_inlab > '" + startDate + "' AND las_inlab < '" + endDate + "'";
    }
    
    for (var index = 0; index < time_types.length; index++) {
        var mysqlQuery = "";
        
        mysqlQuery = queryString + " AND inlab_cat = '" + time_types[index] + "'";
        console.log("query string: \n" + mysqlQuery);
        conn.query(mysqlQuery, [], function (err, rows, fields) {
            if (err) {
                throw err;
                          
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                var result = [];
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    result.push(Number(row.tat));
                }
                
                queryResults.push(result);
            }
            
            if (queryResults.length == time_types.length) {
                tatDefinition["tatByTime"]["morning"] = queryResults[0];
                tatDefinition["tatByTime"]["noon"] = queryResults[1];
                tatDefinition["tatByTime"]["afternoon"] = queryResults[2];
                callback && callback(func, tatDefinition);
                console.log(queryResults);
            }
        });
    }
    
    return queryResults;
}

///////////////////////////////////////////////////////////////////////////////////
//query inlab/result/avg_tat in [startDate, endDate]
///////////////////////////////////////////////////////////////////////////////////
function queryTatMultiPlot(startDate, endDate, callback, func) {
    var queryString = "SELECT COUNT(*) as count FROM tat WHERE tat > 0 AND tat < 200";
    var conn = getConnection();
    //var time_types = ["morning", "noon", "afternoon"];
    var query_result = multiplotDefinition;
    
    var queryResults = [];
    var count = 0;
    
    if (startDate && endDate) {
        queryString += " AND las_inlab > '" + startDate + "' AND las_inlab < '" + endDate + "'";
    }
    //1.query las inlab count
    for (var index = 0; index < multiplotDefinition["hours"].length; index++) {
        var mysqlQuery = "";
        
        mysqlQuery = queryString + " AND HOUR(las_inlab) = '" + multiplotDefinition["hours"][index] + "'";
        //console.log("query string: \n" + mysqlQuery);
        conn.query(mysqlQuery, [], function (err, rows, fields) {
            if (err) {
                throw err;
                
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                //
                queryResults.push(rows[0].count);
            }
            
            if (queryResults.length == multiplotDefinition["hours"].length) {
                query_result["inlab_count"] = queryResults
                //callback && callback(func, query_result);
                console.log(queryResults);
                queryResults = [];
            }
        });
    }

    //2.query lis_result count
    queryResults = [];
    for (var index = 0; index < multiplotDefinition["hours"].length; index++) {
        var mysqlQuery = "";
        
        mysqlQuery = queryString + " AND HOUR(lis_upload) = '" + multiplotDefinition["hours"][index] + "'";
        //console.log("query string: \n" + mysqlQuery);
        conn.query(mysqlQuery, [], function (err, rows, fields) {
            if (err) {
                throw err;
                
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                //
                queryResults.push(rows[0].count);
            }

            if (queryResults.length == multiplotDefinition["hours"].length) {
                query_result["result_count"] = queryResults
                //callback && callback(func, query_result);
                console.log(queryResults);
                queryResults = [];
                //console.log(query_result)
            }
        });
    }
    
    //3. query for tat per hour
    var tatQueryString = "SELECT round(AVG(tat)) as avg_tat FROM tat WHERE tat > 0 AND tat < 200";
    if (startDate && endDate) {
        tatQueryString += " AND las_inlab > '" + startDate + "' AND las_inlab < '" + endDate + "'";
    }

    for (var index = 0; index < multiplotDefinition["hours"].length; index++) {
        var mysqlQuery = "";
        
        mysqlQuery = tatQueryString + " AND HOUR(las_inlab) = '" + multiplotDefinition["hours"][index] + "'";
        //console.log("query string: \n" + mysqlQuery);
        conn.query(mysqlQuery, [], function (err, rows, fields) {
            if (err) {
                throw err;
                
                return false;
            } else if (rows.length == 0) {
                row = null;
            } else {
                //
                var avg_tat = 0;
                //console.log('get tat: ' + rows[0].avg_tat);
                if (rows[0].avg_tat != null){
                    avg_tat = rows[0].avg_tat;
                }
                queryResults.push(avg_tat);
            }
            
            if (queryResults.length == multiplotDefinition["hours"].length) {
                query_result["avg_tat"] = queryResults
                callback && callback(func, query_result);
                console.log(queryResults);
                queryResults = [];
                console.log(query_result)
            }
        });
    }
    
    return queryResults;
}

//queryTatCount(null,null,callbackMySqlCountDone,displayTat);
//queryTatPerAnalyzers(null,null, callbackMySqlAnalyzerDone, displayAnalyzerTat);

exports.queryTatCount = queryTatCount;
exports.queryTatPerAnalyzers = queryTatPerAnalyzers;
exports.queryTatPerTimes = queryTatPerTimes;
exports.queryTatMultiPlot = queryTatMultiPlot;



