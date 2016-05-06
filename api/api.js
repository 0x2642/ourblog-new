var express = require('express');
var router = express.Router();
var dao = require('../dao/indexDAO.js');
var util = require('../util');
var article=dao.Article

/* GET API */
router.get('/article/:id', function(req, res, next) {
	id=req.params.id || 1;
	article.getSingleArticleById(id,function (err,article) {
		res.send(article);
	})
  
});
router.get('/list', function(req, res, next) {
	var page=req.param('page') || 1;
	var auth=util.Cookies.getCookie(req,'auth');
	var searchList={"tags":"String","title":"String","author":"String"};

	for(var key in searchList) {
		req.param(key)?searchList[key]=eval("/"+util.Strings.filter(req.param(key),searchList[key])+"/"):delete searchList[key];
	}
	
	var pagesize=util.Constant.get('PAGE_SIZE');
	page=Math.abs(page-1)
	var option={"skip":page*pagesize,"limit":pagesize}
	console.log(searchList)
	// list[page]||{}
	article.getArticleList(searchList,'',option,'',function(err,data,count){
		var ret={"articles":data,"pagenation":{"current": page+1,"max": Math.ceil(count/pagesize)}}
		res.send(ret)
	});
});
module.exports = router;
