'use strict';

var mysql           = require('mysql2');
var http            = require('http');
var async           = require('async');
var Router          = require('router');
var finalhandler    = require('finalhandler');
var compression     = require('compression');
var url             = require('url');
var get             = require('./lib/get.js');
var add             = require('./lib/add.js');
var update          = require('./lib/update.js');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database: 'hackday2016'
});

connection.connect();

var router = Router();
var server = http.createServer(function onRequest(req, res) {
    router(req, res, finalhandler(req, res))
});

router.use(compression());

// 参照系
router.get('/get/commodity_info', function (req, res) {
    get.commodity_info(req, res, connection);
});

router.get('/get/commodity_history', function (req, res) {
    get.commodity_history(req, res, connection);
});

router.get('/get/user_setting', function (req, res) {
    get.user_setting(req, res, connection);
});

// 登録系
router.get('/add/commodity_history', function (req, res) {
    add.commodity_history(req, res, connection);
});

router.get('/add/user_setting', function (req, res) {
    add.user_setting(req, res, connection);
});

// 更新系
router.get('/update/user_setting', function (req, res) {
    update.user_setting(req, res, connection);
});

server.listen(8080);
