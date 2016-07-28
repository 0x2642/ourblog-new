var express = require('express');
var router = express.Router();
var dao = require('../dao/indexDAO.js');
var util = require('../util');
var Article = dao.Article;
var User = dao.User;

/* GET API */
router.get('/article/:id', function(req, res, next) {
	id = req.params.id || 1;
	Article.getSingleArticleById(id, function(err, article) {
		if (err) {
			res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'))
		} else {
			if (article!==null) {
				res.send(article);
			} else {
				res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'))
			}
		}

		
	})
});

router.post('/article', function(req, res, next) {
	var post_info = req.body
	var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
	post_info['tags']=post_info['tags'].replace(/,|，/g,",").split(',');
	post_info['content']=post_info['content-markdown-doc'];
	if (auth) {
		User.getSingleUserByAuth(auth,function(err,user){
			if(err){
				res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'))
			}else{
				author={'id':user['_id'].toString(),'name':user['name']};
				post_info['author']=author;
				Article.save(post_info,function(err){
					if (err) {
						res.send(getErrorString('ERROR_ARTICLE_SAVE_FAIL'))
					}else{
						res.send(getSuccessString('SUCCESS_ARTICLE_SAVE'))
					}
				})
			}
		})
	} else {
		res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'))
	}
	
});

router.get('/list', function(req, res, next) {
	var page = req.query.page || 1;
	var pagesize = req.query.pagesize || util.Constant.get('PAGE_SIZE');
	var auth =  req.query.auth || util.Cookies.getCookie(req, 'auth');
	var is_auth =  req.query.is_auth || 0;

	var searchList = {
		"tags": "String",
		"title": "String",
		"author": "String"
	};

	for (var key in searchList) {
		req.param(key) ? searchList[key] = eval("/" + util.Strings.filter(req.param(key), searchList[key]) + "/") : delete searchList[key];
	}

	page = Math.abs(page - 1)
	var option = {
		"skip": page * pagesize,
		"limit": parseInt(pagesize)
	}

	if (auth && is_auth>0) {
		
		User.getSingleUserByAuth(auth,function(err,user){

			if(err){
				res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'))
			}else{
				var time_now=new Date().getTime();
				if (user!==null) {
					if (time_now-user.login_time > util.Constant.get('LOGIN_TIMEOUT')) {
						res.send(getErrorString('ERROR_LOGIN_USER_TIMEOUT'))
					} else {
						searchList['author.id']=user._id+""
						searchList['status']={"$gte":util.Constant.get('ARTICLE_STATUS_DRAFT')}
						console.log(searchList)
						getArticleList(searchList,option,page,pagesize,res)
					}
				} else {
					res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'))
				}
			}
		})
		
	}else{
		searchList['status']=util.Constant.get('ARTICLE_STATUS_RELEASE');
		getArticleList(searchList,option,page,pagesize,res)
	}

});

router.post('/del', function(req, res, next) {
	var id = req.body.id
	console.log(id)
	var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
	if (auth) {
		User.getSingleUserByAuth(auth,function(err,user){
			if(err){
				res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'))
			}else{
				Article.del(id,function(err){
					if (err) {
						res.send(getErrorString('ERROR_ARTICLE_SAVE_FAIL'))
					}else{
						res.send(getSuccessString('SUCCESS_ARTICLE_SAVE'))
					}
				})
			}
		})
	} else {
		res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'))
	}
	
});


function getArticleList(searchList,option,page,pagesize,res){
	Article.getArticleList(searchList, '', option, '', function(err, data, count) {
		var ret = {
			"articles": data,
			"pagenation": {
				"current": page + 1,
				"max": Math.ceil(count / pagesize)
			}
		}
		res.send(ret)
	});
}

function getErrorString(err_name) {
	return  util.Strings.sendError2JSON(util.Lang.get(err_name),util.Constant.get(err_name+"_CODE"));
}

function getSuccessString(err_name) {
	return  util.Strings.sendError2JSON(util.Lang.get(err_name),0);
}

module.exports = router;