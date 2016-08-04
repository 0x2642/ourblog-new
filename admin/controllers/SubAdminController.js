var EventProxy = require('eventproxy');
var strings = require('../strings.js');
var path = require("path");
var Dao = require('../../dao/indexDAO.js');
var admin = Dao.Admin;

exports.dashboardIndex = function(req, res, next) {
	res.render(path.join(getViewPath() + 'view/subadmin/subadmin_dashboard.ejs'),
		adminViewTextElement());
}

exports.messageLeaveIndex = function(req, res, next) {
	res.render(path.join(getViewPath() + 'view/subadmin/subadmin_message.ejs'),
		adminViewTextElement());
}

exports.messageSubmit = function(req, res, next) {
	var message = req.body.message;
	var ep = new EventProxy();
	ep.fail(next);
	logger('message: ' + message);

	ep.on('fail', function(errmsg) {
		res.status(200);
		res.render(path.join(getViewPath() + 'view/admin_error.ejs'),
			adminViewTextElement(errmsg));
	});

	admin.getAdminByEmail('4399@qq.com', function(err, user){
		if (err) {
			logger('Get admin by email error');
			ep.emit('fail', 'get admin by email fail');
		} else {
			user.comments.push(message);
			admin.updateCommnets(user, function(err) {
				if (err) {
					logger('Update comment fail');
					ep.emit('fail', 'update comment fail');
				}
				res.redirect('/admin/subadmin_dashboard');
			})
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
