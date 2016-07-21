var express = require('express');
var router = express.Router();
var app = express();
var path    = require("path");
var request = require("request");
var formidable = require('formidable');
var fs=require("fs");
var dao = require('../dao/indexDAO.js');
var user = dao.User;
var authLog = dao.AuthLog;
var util = require('../util');

var global_create_cert_token='';

router.use(function (req, res, next) {
	var url = req.originalUrl;
	var exclude=["/login","/applyAuthorized","/applyTmpAuthorized","/confirmAuthorized","createCertificate"];
	var allow_flag=true;
	for (var i = exclude.length - 1; i >= 0; i--) {
		if (url.indexOf(exclude[i])<0 && !util.Cookies.getCookie(req,'user')) {
	    	allow_flag=false;
		}else{
			allow_flag=true;
			break;
		}
	}

	if (!allow_flag) {
	    return res.redirect("/admin/login");
	}
  	next();
});




router.get('/', function(req, res, next) {
	res.render(path.join(__dirname+'/view/index.ejs'),{title: 'jade'});
});
router.get('/articlelist', function(req, res, next) {
	res.render(path.join(__dirname+'/view/articlelist.ejs'),{title: 'Umiumiu'});
});

router.get('/login',function(req, res, next){
	var msg=''
	if (req.query.msg!=undefined && req.query.msg!=null) {msg=req.query.msg}

	res.render(path.join(__dirname+'/view/login.ejs'),{title: 'Umiumiu',msg:msg});
});

router.post('/login', function(req, res, next) {
	var form = new formidable.IncomingForm();
	 form.parse(req,function(error, fields, files){
	 	try {
	 	 var data=fs.readFileSync(files.certificate.path,"utf-8");
	 	 data=data.replace(/\r\n|\r/g,"\n").split('\n')
	 	 if (data.length<util.Constant.get('LOGIN_CERTIFICATE_LENGTH')) { return res.redirect("/admin/login?msg="+util.Lang.get('ERROR_LOGIN_CERTIFICATE_ILLEGAL'));}
	 	 var username=data[0].substring(data[0].indexOf(':')+1)
	 	 var userkey=data[1].substring(data[1].indexOf(':')+1)
	 	 user.getSingleUserByName(username, function(err, user) {
		 	if (user==null) { return res.redirect("/admin/login?msg="+util.Lang.get('ERROR_LOGIN_USER_NOT_EXIST'))}
		 	if(verift(user,userkey)){
		 		afterLogin(res,user);
		 	}else{
		 		return res.redirect("/admin/login?msg="+util.Lang.get('ERROR_LOGIN_USER_VERIFT_FAIL'))
		 	}	
		 })
	 	} catch (err) {
    		res.send("The file upload fail!");
		}
        
    });

});

router.get('/applyAuthorized', function(req, res, next) {
	var msg='';
	var is_tmp=0;
	if (req.query.msg!=undefined && req.query.msg!=null) {msg=req.query.msg}
	if (req.query.is_tmp!=undefined && req.query.is_tmp!=null) {is_tmp=req.query.is_tmp}

	res.render(path.join(__dirname+'/view/applyauthorized.ejs'),{title: 'Umiumiu',msg:msg,is_tmp:is_tmp});
});


router.post('/applyAuthorized', function(req, res, next) {
	user.getSingleUserByEmail(req.body.email, function(err, user) {
			if (err) {
				return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_FAIL'))
			} else {
				if (user !== null) {

					authLog.saveAuth(user,req.body.is_tmp,function(err,token,salt){

						if (err) {
							return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_FAIL'))
						} else {
							var url="http://"+req.headers.host+"/admin/confirmAuthorized/token/"+token;
							util.Mail.sendApplyAuthorized(req.body.email,url,salt)
							return  res.redirect("/admin/login");
						}
					});

				} else {
					return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_USER_NOT_EXIST'))
				}
			}
	});
});

router.get('/confirmAuthorized/token/:token', function(req, res, next) {
	var token = req.params.token;
	var msg='';
	if (req.query.msg!=undefined && req.query.msg!=null) {msg=req.query.msg}

	res.render(path.join(__dirname+'/view/confirmauthorized.ejs'),{title: 'Umiumiu',msg:msg,token:token});
});

router.post('/confirmAuthorized', function(req, res, next) {

	authLog.getAuthLogByToken(req.body.token,function(err,auth_log){
		if (err) {
			return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_FAIL'))
		} else {
			var time_now=new Date().getTime();
			if (auth_log!==null) {
				console.log(auth_log)
				if (auth_log.salt!=req.body.code) {
					return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_CODE'))
				}else if(time_now-auth_log.apply_time>=util.Constant.get('APPLY_CERTIFICATE_TIMEOUT')){
					return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_TIMEOUT'))
				} else {
					global_create_cert_token=util.Crypto.md5((Math.round(Math.random() * 899999) + 100000+req.body.token));
					var path="http://"+req.headers.host+"/admin/createCertificate?token="+global_create_cert_token+"&seed="+req.body.seed+"&mail="+auth_log.mail;
					res.writeHead(200, {
				      'Content-Type': 'application/force-download',
				      'Content-Disposition': 'attachment; filename=login.cert'
				    });
					request(path).pipe(res);
				     
				}
			} else {
				return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_TOKEN_ILLEGAL'))
			}
		}
	});
});

router.get('/createCertificate', function(req, res, next) {
	var token = req.query.token;
	var seed = req.query.seed;
	var mail = req.query.mail;
	if (token!=global_create_cert_token) {
		res.send(util.Lang.get('ERROR_APPLY_AUTHORIZED_TOKEN_ILLEGAL'));
	} else {
		user.getSingleUserByEmail(mail,function(err,user){
			if (err) {
				return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_FAIL'))
			} else {
				if (user!==null) {
					createCertificate(user,seed,token,res);
				} else {
					return res.redirect("/admin/applyAuthorized?msg="+util.Lang.get('ERROR_APPLY_AUTHORIZED_USER_NOT_EXIST'))					
				}
			}
		});
	}
});


function createCertificate(userObj,seed,code,res){
	var token_new = util.Crypto.md5 (userObj.name+seed+new Date().getTime()+code+"");
	user.updateToken(userObj,token_new,function(err){
		var token=token_new.substring(0,16)+userObj.name+token_new.substring(16);
		token=util.Crypto.md5(token);
		var token_list=[];
		for (var i = 0; i < 8; i++) {
			token_list.push(util.Crypto.md5(token.substr(i*4,4).substring(0,2)+token_new+token.substr(i*4,4).substring(2)+util.Crypto.md5(userObj.name)));
		}
		var text=token_list.join("")
		var key=util.Crypto.base64(text,util.Config.get('login_secret').LOGIN_CERTIFICATE_SECRET,'base64');
		text="User-Name:"+userObj.name+"\nkey:"+key;

		res.send(text);
	});

}

function verift(user,userkey) {
	
	var token=user.token.substring(0,16)+user.name+user.token.substring(16);
	token=util.Crypto.md5(token);
	var token_list=[];
	for (var i = 0; i < 8; i++) {
		token_list.push(util.Crypto.md5(token.substr(i*4,4).substring(0,2)+user.token+token.substr(i*4,4).substring(2)+util.Crypto.md5(user.name)));
	}
	// var key=util.Crypto.base64(token_list.join(""));
	var key=util.Crypto.base64(token_list.join(""),util.Config.get('login_secret').LOGIN_CERTIFICATE_SECRET,'base64');
	// console.log(key)
	return userkey==key;

}

// 等待更新auth操作

function afterLogin(res,userObj) {

	user.updateAuth(userObj,function(err,auth){

		if (!err) {
			util.Cookies.setCookie(res,'user',userObj.name);
			util.Cookies.setCookie(res,'auth',auth);
			return res.redirect("/admin");
		} else {
			return res.redirect("/admin/login?msg="+util.Lang.get('ERROR_LOGIN_FAIL'));
		}

	})

}

module.exports = router;