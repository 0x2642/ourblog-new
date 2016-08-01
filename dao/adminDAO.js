var AdminModel = require('../models/db').Admin;

exports.getAdminByEmail = function(email, callback) {
	AdminModel.findOne({
		email: email
	}, function(err, admin) {
		if (err) {
			callback(err);
		}
		callback(null, admin);
	});
}

exports.setNewAdmin = function(newAdmin, callback) {
	var mAdminModel = new AdminModel();
	mAdminModel.username = newAdmin.username;
	mAdminModel.password = newAdmin.password;
	mAdminModel.email = newAdmin.email;
	mAdminModel.add_time = newAdmin.add_time;
	mAdminModel.level = newAdmin.level;
	mAdminModel.save(callback);
}
