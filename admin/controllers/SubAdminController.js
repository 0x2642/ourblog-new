var EventProxy = require('eventproxy');
var strings = require('../strings.js');
var path = require("path");
var Dao = require('../../dao/indexDAO.js');
var adminCtl = Dao.Admin;

exports.dashboardIndex = function(req, res, next) {
	res.render(path.join(getViewPath() + 'view/subadmin/subadmin_dashboard.ejs'),
		adminViewTextElement());
}

exports.messageLeaveIndex = function(req, res, next) {
	res.render(path.join(getViewPath() + 'view/subadmin/subadmin_message.ejs'),
		adminViewTextElement());
}

exports.messageListIdx = function(req, res, next) {
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('fail', function(errmsg) {
		res.status(200);
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'),
			adminViewTextElement(errmsg));
	});

	adminCtl.getAdminByEmail('4399@qq.com', function(err, admin) {
		if (err) {
			logger('Get admin by email error');
			ep.emit('fail', 'get admin by email fail');
		} else {
			res.render(path.join(getViewPath() + 'view/subadmin/subadmin_message_list.ejs'), {
				title: strings.getPageTitle('STR_ADMIN_01_01_01'),
				sidebar_dashboard: strings.getPageTitle('STR_ADMIN_01_02_01'),
				admin: admin
			});
		}
	});
}

exports.messageSubmit = function(req, res, next) {
	var message = req.body.message;
	var target_email = '4399@qq.com';  // May change to session
	var ep = new EventProxy();
	ep.fail(next);

	ep.on('fail', function(errmsg) {
		res.status(200);
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'),
			adminViewTextElement(errmsg));
	});

	adminCtl.getAdminByEmail(target_email, function(err, admin) {
		if (err) {
			logger('Get admin by email error');
			ep.emit('fail', 'get admin by email fail');
		} else {
			var new_comments = admin.comments;
			new_comments.push(message);
			logger('new commnets: ' + new_comments.toString());
			adminCtl.updateCommnets(target_email, new_comments, function(err) {
				if (err) {
					logger('Update comment fail');
					ep.emit('fail', 'update comment fail');
				}
				res.redirect('/admin/subadmin_dashboard');
			});
		}
	});
}

function adminViewTextElement(msg) {
	var msg = msg || '';
	var admins = admins || [];
	return {
		title: strings.getPageTitle('STR_ADMIN_01_01_01'),
		sidebar_dashboard: strings.getPageTitle('STR_ADMIN_01_02_01'),
		msg: msg
	}
}

function logger(loggerContent) {
	console.log("SubAdminController --> " + loggerContent);
}

function getViewPath() {
	var base_str = path.basename(__dirname);
	return __dirname.split(base_str)[0];
}