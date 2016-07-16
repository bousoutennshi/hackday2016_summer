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

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(results[0]);
    });
});

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

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(results[0]);
    });
});

router.get('/add/user_setting', function (req, res) {
    connection.connect();

    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'INSERT INTO user_setting (user_id, commodity_id, limit_weight, flag (' +
                "'" + url_parts.query.user_id + "'," +
                url_parts.query.commodity_id + "," +
                url_parts.query.limit_weight + "," +
                "'" + url_parts.query.flag + "')";
            connection.query(sql + ';', (err, rows, fields) => {
                if (err) throw err;

                var json = JSON.stringify(rows);
                callback(null, json);
            });
        }
    ], function (err, results) {
        if (err) throw err;

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(results[0]);
    });
});

server.listen(8080);
