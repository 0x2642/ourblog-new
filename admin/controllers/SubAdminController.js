var EventProxy = require('eventproxy');
var strings = require('../strings.js');
var path = require("path");
var Dao = require('../../dao/indexDAO.js');
var adminCtl = Dao.Admin;
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

exports.messageSubmit = function(req, res, next) {
	renderRequest(req, res, next, null, 'msg_submit');
}

exports.subAdminLogin = function(req, res, next) {
	renderRequest(req, res, next, null, 'sub_admin_login');
}

function renderRequest(req, res, next, target_view, type) {
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
				} else if (type == 'sub_admin_login') {
					subAdminLoginRequest(req, res, next, admin);
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
	adminCtl.updateCommnets(email, new_comments, function(err) {
		if (err) {
			logger('Update comment fail');
			ep.emit('update_fail', strings.getPageTitle('STR_ADMIN_ERR_06'));
		}
		res.redirect('/admin/subadmin_dashboard');
	});
}

function subAdminLoginRequest(req, res, next, admin) {
	var mPassword = crypto.md5(req.body.pwd);
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('login_fail', function(errmsg) {
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'), {
			err_msg: errmsg
		});
	});

	if (admin.password != mPassword) {
		logger('password do not match');
		ep.emit('login_fail', strings.getPageTitle('STR_ADMIN_ERR_07'));
	} else {
		logger('login success');
		util.Cookies.setCookie(res, 'sub_admin', admin, {
			expires: new Date(Date.now() + consts.get('LOGIN_TIMEOUT'))
		});
		res.redirect('/admin/subadmin_dashboard');
	}
}

exports.subadminLogout = function(req, res, next) {
	util.Cookies.delCookie(res, delCookie);
	res.redirect('/admin/login');
}

function logger(loggerContent) {
	console.log("SubAdminController --> " + loggerContent);
}

function getViewPath() {
	var base_str = path.basename(__dirname);
	return __dirname.split(base_str)[0];
}