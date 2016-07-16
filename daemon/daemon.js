'use strict';

var mysql   = require('mysql2');
var async   = require('async');
var Promise = require('bluebird');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database: 'hackday2016'
});

connection.connect();

Promise.resolve(0).then(function loop(i) {
    return new Promise(function(resolve, reject) {
        async.series([
            function (callback) {
                var sql = "SELECT * from commodity_history WHERE user_id = 'dkawashi' AND commodity_id = 1 ORDER BY update_time DESC LIMIT 1";
                connection.query(sql + ';', (err, rows, fields) => {
                    if (err) throw err;

                    callback(null, rows);
                });
            },
            function (callback) {
                var sql = "SELECT * from user_setting WHERE user_id = 'dkawashi' AND commodity_id = 1";
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
            if (
                0 < weight && weight < limit_weight &&
                filter === 'off'
            ) {
                console.log("LOHACO.");
            } else {
                console.log("skip.");
            }
        });

        resolve(i+1);
    })
    .delay(5000)
    .then(loop);
});
