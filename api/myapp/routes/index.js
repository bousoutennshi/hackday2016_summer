var express = require('express');
var router = express.Router();

var glob = require('glob');

glob('views/*.ejs', null, function (er, files) {
	files.forEach(function(file) {
		var path = file.match(new RegExp('views/(.*)\.ejs'))[1];
		router.get('/'+path, function(req, res, next) {
			res.render(path, {});
		});
	});
});

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});


module.exports = router;
