var async   = require('async');
var url     = require('url');

exports.user_setting = function (req, res, connection) {
    async.series([
        function (callback) {
            var url_parts = url.parse(req.url,true);
            var sql = 'UPDATE user_setting SET ';
            var update = [];
            if (typeof url_parts.query.limit_weight !== 'undefined') {
                update.push('limit_weight=' + url_parts.query.limit_weight);
            }
            if (typeof url_parts.query.filter !== 'undefined') {
                update.push('filter=' + "'" + url_parts.query.filter + "'");
            }
            if (typeof url_parts.query.status !== 'undefined') {
                update.push('status=' + url_parts.query.status);
            }
            sql = sql + update.join(",") +
                " WHERE user_id = '" + url_parts.query.user_id +
                "' AND commodity_id = " + url_parts.query.commodity_id;
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
