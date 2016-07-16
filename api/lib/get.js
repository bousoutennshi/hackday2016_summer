var async   = require('async');
var url     = require('url');

exports.commodity_info = function (req, res, connection) {
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
};

exports.commodity_history = function (req, res, connection) {
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
};

exports.user_setting = function (req, res, connection) {
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
};

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
