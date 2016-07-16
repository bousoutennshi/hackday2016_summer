'use strict';

var mysql           = require('mysql2');
var http            = require('http');
var async           = require('async');
var Router          = require('router');
var finalhandler    = require('finalhandler');
var compression     = require('compression');
var url             = require('url');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database: 'hackday2016'
});

var router = Router();
var server = http.createServer(function onRequest(req, res) {
    router(req, res, finalhandler(req, res))
});

router.use(compression());

// 参照系
router.get('/get/commodity_info', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'SELECT * from commodity_info';
            if (typeof url_parts.query.commodity_id !== 'undefined') {
                sql = sql + ' WHERE commodity_id = ' + url_parts.query.commodity_id;
            }
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        output(res, results[0]);
    });
});

router.get('/get/commodity_history', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'SELECT * from commodity_history WHERE';
            if (typeof url_parts.query.user_id !== 'undefined') {
                sql = sql + " user_id = '" + url_parts.query.user_id + "'";
            }
            if (typeof url_parts.query.commodity_id !== 'undefined') {
                sql = sql + " AND commodity_id = " + url_parts.query.commodity_id;
            }
            sql = sql + ' ORDER BY update_time DESC';
            if (typeof url_parts.query.results !== 'undefined') {
                sql = sql + " LIMIT " + url_parts.query.results;
            }
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        output(res, results[0]);
    });
});

router.get('/get/user_setting', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'SELECT * from user_setting WHERE';
            if (typeof url_parts.query.user_id !== 'undefined') {
                sql = sql + " user_id = '" + url_parts.query.user_id + "'";
            }
            if (typeof url_parts.query.commodity_id !== 'undefined') {
                sql = sql + " AND commodity_id = " + url_parts.query.commodity_id;
            }
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        output(res, results[0]);
    });
});

// 登録系
router.get('/add/commodity_history', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'INSERT INTO commodity_history (user_id, commodity_id, weight) values (' +
                "'" + url_parts.query.user_id + "'," +
                url_parts.query.commodity_id + "," +
                url_parts.query.weight + ')';
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        output(res, results[0]);
    });
});

router.get('/add/user_setting', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'INSERT INTO user_setting (user_id, commodity_id, limit_weight, filter, status) values (' +
                "'" + url_parts.query.user_id + "'," +
                url_parts.query.commodity_id + "," +
                url_parts.query.limit_weight + "," +
                "'" + url_parts.query.filter + "'," +
                url_parts.query.status + ")";
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        output(res, results[0]);
    });
});

// 更新系
router.get('/update/user_setting', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'UPDATE user_setting SET ';
            var update = [];
            if (typeof url_parts.query.filter !== 'undefined') {
                update.push('filter=' + "'" + url_parts.query.filter + "'");
            }
            if (typeof url_parts.query.status !== 'undefined') {
                update.push('status=' + url_parts.query.status);
            }
            sql = sql + update.join(",") + " WHERE user_id = '" + url_parts.query.user_id + "' AND commodity_id = " + url_parts.query.commodity_id;
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        output(res, results[0]);
    });
});

server.listen(8080);

function output (res, body) {
        res.writeHead(
            200,
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        );
        res.end(body);
}
