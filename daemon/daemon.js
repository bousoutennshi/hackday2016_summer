'use strict';

var mysql   = require('mysql2');
var async   = require('async');
var Promise = require('bluebird');
var request = require('request');
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
            var counter = results[1][0].counter;
            if (
                25 < weight && weight < limit_weight && // 閾値を下回る
                filter === 'off' && // フィルターがOFFである
                stat !== 1 // 注文したステータスではない
            ) {
                if (counter === 2) {
                    // 条件を満たした場合注文トリガー送信とステータスをUPDATE
                    var headers = {
                        'meshblu_auth_uuid': 'db71a3fe-0fc9-45ef-bb0b-8f19a90e25a1',
                        'meshblu_auth_token': 'ea45b69a'
                    };
                    var options = {
                        url: 'http://210.140.83.12/data/db71a3fe-0fc9-45ef-bb0b-8f19a90e25a1',
                        headers: headers,
                        form: {key:'value'}
                    };
                    request.post(options, function (error, response, body) {
                        update_status(connection, user_id, commodity_id, 1);
                        update_counter(connection, user_id, commodity_id, 0);
                        console.log("I post to mythings. user_id : "+user_id+" commodity_id : "+commodity_id);
                    });
                } else {
                    counter = counter + 1;
                    update_counter(connection, user_id, commodity_id, counter);
                }
            } else {
                // 制限の重さ以上の物が置かれた場合ステータスをリセット
                if (weight > limit_weight) {
                    update_status(connection, user_id, commodity_id, 0);
                    update_counter(connection, user_id, commodity_id, 0);
                }
                if (25 > weight) {
                    update_counter(connection, user_id, commodity_id, 0);
                }
            }
        });

        resolve(i+1);
    })
    .delay(2000)
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

function update_counter (connection, user_id, commodity_id, counter) {
    var sql = "UPDATE user_setting SET counter=" + counter +
        " WHERE user_id = '"+user_id+"' AND commodity_id = "+commodity_id;
    connection.query(sql + ';', (err, rows, fields) => {
        if (err) throw err;

        console.log("update user_setting counter : "+counter);
    });
}
