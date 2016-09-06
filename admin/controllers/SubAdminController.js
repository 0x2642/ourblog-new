var EventProxy = require('eventproxy');
var strings = require('../strings.js');
var path = require("path");
var Dao = require('../../dao/indexDAO.js');
var adminCtl = Dao.Admin;
var articleCtl = Dao.Article;
var util = require('../../util');
var crypto = require('../../util/crypto');
var consts = require('../../util/constant');

exports.dashboardIndex = function(req, res, next) {
	renderRequest(req, res, next, 'view/subadmin/subadmin_dashboard.ejs', 'index');
}

exports.messageLeaveIndex = function(req, res, next) {
	renderRequest(req, res, next, 'view/subadmin/subadmin_message.ejs', 'index');
}

exports.messageListIdx = function(req, res, next) {
	renderRequest(req, res, next, 'view/subadmin/subadmin_message_list.ejs', 'index');
}

exports.articlePostIndex = function(req, res, next) {
	renderRequest(req, res, next, 'view/subadmin/subadmin_article.ejs', 'index');
}

exports.messageSubmit = function(req, res, next) {
	renderRequest(req, res, next, null, 'msg_submit');
}

exports.subAdminLogin = function(req, res, next) {
	renderRequest(req, res, next, null, 'sub_admin_login');
}

exports.artilePostSubmit = function(req, res, next) {
	renderRequest(req, res, next, null, 'art_submit');
}

function renderRequest(req, res, next, target_view, type) {
	if (type == 'sub_admin_login') {
		logger('Begin to login subAdmin');
		subAdminLoginRequest(req, res, next);
		return;
	}

	if (null == util.Cookies.getCookie(req, 'sub_admin')) {
		res.redirect('/admin/subadmin_dashboard');
		return;
	}

	var cur_admin_email = util.Cookies.getCookie(req, 'sub_admin').email;
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('render_fail', function(errmsg) {
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'), {
			err_msg: errmsg
		});
	});

	if (null != cur_admin_email) {
		adminCtl.getAdminByEmail(cur_admin_email, function(err, admin) {
			if (err) {
				logger('Get admin by email error');
				ep.emit('render_fail', strings.getPageTitle('STR_ADMIN_ERR_05'));
			} else {
				if (type == 'index') {
					indexRenderRequest(res, admin, target_view);
				} else if (type == 'msg_submit') {
					messageSubmitRequest(req, res, next, admin);
				} else if (type == 'art_submit') {
					articleSubmitRequest(req, res, next, admin);
				} else {
					// TODO Nothing
				}
			}
		});
	} else {
		logger('cur_admin_email is null');
		ep.emit('render_fail', strings.getPageTitle('STR_ADMIN_ERR_05'));
	}
}

function indexRenderRequest(res, admin, target_view) {
	res.render(path.join(getViewPath() + target_view), {
		title: strings.getPageTitle('STR_ADMIN_01_01_01'),
		sidebar_dashboard: strings.getPageTitle('STR_ADMIN_01_02_01'),
		admin: admin
	});
}

function contractTags(tag, tags) {
	// Exclude empty tags
	if (null != tag && undefined != tag && tag.length > 0) {
		tags.push(tag);
	}
	return tags;
}

function articleSubmitRequest(req, res, next, admin) {
	var tags = [];
	tags = contractTags(req.body.tag3, contractTags(req.body.tag2, 
		contractTags(req.body.tag1, tags)));
	console.log('tags: ' + tags);

	var userInfo = {
		author: {
			'id': '11', 
			'name': admin.username
		},
		title: req.body.article_title,
		description: req.body.article_description,
		content: req.body.article_context,
		createTime: new Date().getTime(),
		thumb: 'images/thumb.jpg',
		status: 1,
		tags : tags
	};
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('save_error', function(errmsg) {
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'), {
			err_msg: errmsg
		});
	});

	articleCtl.save(userInfo, function(err) {
		if (err) {
			ep.emit('save_error', strings.getPageTitle('STR_ARTICLE_ERR_01'));
		} else {
			res.redirect('/admin/subadmin_dashboard');
		}
	});
}

function messageSubmitRequest(req, res, next, admin) {
	var message = req.body.message;
	var new_comments = admin.comments;
	var email = admin.email;
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('update_fail', function(errmsg) {
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'), {
			err_msg: errmsg
		});
	});

	new_comments.push(message);
	logger('new commnets: ' + new_comments.toString());

	adminCtl.updateAdminStatus(email, 'comments', new_comments, function(err) {
		if (err) {
			logger('Update comment fail');
			ep.emit('update_fail', strings.getPageTitle('STR_ADMIN_ERR_06'));
		}
		res.redirect('/admin/subadmin_dashboard');
	});
}

function subAdminLoginRequest(req, res, next) {
	var mPassword = crypto.md5(req.body.pwd);
	var mEmail = req.body.email;
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('login_fail', function(errmsg) {
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'), {
			err_msg: errmsg
		});
	});

	adminCtl.getAdminByEmail(mEmail, function(err, subadmin) {
		if (err) {
			logger('find subadmin fail');
			ep.emit('login_fail', strings.getPageTitle('STR_ADMIN_ERR_01'));
		} else {
			if (subadmin.password != mPassword) {
				logger('password do not match');
				ep.emit('login_fail', strings.getPageTitle('STR_ADMIN_ERR_07'));
			} else {
				logger('login success');
				// Set subadmin info into cookies
				util.Cookies.setCookie(res, 'sub_admin', subadmin, {
					expires: new Date(Date.now() + consts.get('LOGIN_TIMEOUT'))
				});
				adminCtl.updateOnline(subadmin.email, true, function(err) {
					if (err) {
						logger('Update is_online fail');
						ep.emit('update_fail', strings.getPageTitle('STR_ADMIN_ERR_06'));
					} else {
						res.redirect('/admin/subadmin_dashboard');
					}
				});
			}
		}
	});
}

exports.subadminLogout = function(req, res, next) {
	var cur_admin_email = util.Cookies.getCookie(req, 'sub_admin').email;
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('update_fail', function(errmsg) {
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'), {
			err_msg: errmsg
		});
	});

	adminCtl.updateOnline(subadmin.email, false, function(err) {
		if (err) {
			logger('Update is_online fail');
			ep.emit('update_fail', strings.getPageTitle('STR_ADMIN_ERR_06'));
		} else {
			util.Cookies.delCookie(res, delCookie);
			res.redirect('/admin/login');
		}
	});
}

function logger(loggerContent) {
	console.log("SubAdminController --> " + loggerContent);
}

function getViewPath() {
	var base_str = path.basename(__dirname);
	return __dirname.split(base_str)[0];
}