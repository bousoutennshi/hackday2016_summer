var async   = require('async');
var url     = require('url');

exports.commodity_history = function (req, res, connection) {
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
};

exports.user_setting = function (req, res, connection) {
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
