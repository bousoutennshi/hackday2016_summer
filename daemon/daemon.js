'use strict';

var mysql   = require('mysql2');
var async   = require('async');
var Promise = require('bluebird');
var mqtt    = require('mqtt');
var moment  = require("moment");

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

            // 注文判定処理
            var weight = results[0][0].weight;
            var limit_weight = results[1][0].limit_weight;
            var filter = results[1][0].filter;
            var stat = results[1][0].status;
            var update_time = results[1][0].update_time;
            if (
                0 < weight && weight < limit_weight && // 閾値を下回る
                filter === 'off' && // フィルターがOFFである
                stat !== 1 // 注文したステータスではない
            ) {
                // 条件を満たした場合注文トリガー送信とステータスをUPDATE
                update_status(connection, user_id, commodity_id, 1);
                console.log("I sent a mqtt to mythings.");
            } else {
                // 一定の時間立った場合ステータスをリセット
                // statusが1になってから1時間以上経過していた場合リセット
                var diff_time = moment().unix() - moment(update_time).unix();
                if (stat === 1 && diff_time > 3600) {
                    update_status(connection, user_id, commodity_id, 0);
                }
            }
        });

        resolve(i+1);
    })
    .delay(5000)
    .then(loop);
});

function update_status (connection, user_id, commodity_id, stat) {
    var sql = "UPDATE user_setting SET status=" + stat +
        " WHERE user_id = '"+user_id+"' AND commodity_id = "+commodity_id;
    connection.query(sql + ';', (err, rows, fields) => {
        if (err) throw err;

        console.log("update user_setting status : "+stat);
    });
}
