'use strict';

var mysql   = require('mysql2');
var async   = require('async');
var Promise = require('bluebird');
var mqtt    = require('mqtt');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database: 'hackday2016'
});

var user_id = process.argv[2];
var commodity_id = process.argv[3];

connection.connect();

Promise.resolve(0).then(function loop(i) {
    return new Promise(function(resolve, reject) {
        async.series([
            function (callback) {
                var sql = "SELECT * from commodity_history " +
                    "WHERE user_id = '"+user_id+"' AND commodity_id = "+commodity_id +
                    " ORDER BY update_time DESC LIMIT 1";
                connection.query(sql + ';', (err, rows, fields) => {
                    if (err) throw err;

                    callback(null, rows);
                });
            },
            function (callback) {
                var sql = "SELECT * from user_setting " +
                    "WHERE user_id = '"+user_id+"' AND commodity_id = "+commodity_id;
                connection.query(sql + ';', (err, rows, fields) => {
                    if (err) throw err;

                    callback(null, rows);
                });
            }
        ], function (err, results) {
            if (err) throw err;

            // 購入判定処理
            var weight = results[0][0].weight;
            var limit_weight = results[1][0].limit_weight;
            var filter = results[1][0].filter;
            var stat = results[1][0].status;
            if (
                0 < weight && weight < limit_weight &&
                filter === 'off' &&
                stat !== 1
            ) {
                // 条件を満たした場合注文トリガーとステータスをUPDATE
                var sql = "UPDATE user_setting SET status=1 " +
                    "WHERE user_id = '"+user_id+"' AND commodity_id = "+commodity_id;
                connection.query(sql + ';', (err, rows, fields) => {
                    if (err) throw err;
                });
                console.log("I sent a mqtt to mythings.");
            } else {
                console.log("It was skipped.");
            }
        });

        resolve(i+1);
    })
    .delay(5000)
    .then(loop);
});
