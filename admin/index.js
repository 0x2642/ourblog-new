var express = require('express');
var router = express.Router();
var app = express();
var path    = require("path");


router.get('/', function(req, res, next) {
	res.render(path.join(__dirname+'/view/index.ejs'),{title: 'jade'});
});
router.get('/list', function(req, res, next) {
	res.render(path.join(__dirname+'/view/list.ejs'),{title: 'Umiumiu'});
});
module.exports = router;