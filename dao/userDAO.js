var UserModel = require('../models/db').User;
var util = require('../util');

function getUserDetail(post_id, callback) {
	UserModel.findOne({
		_id: post_id
	}, callback);
}

exports.getSingleUserById = function(id, callback) {
	getUserDetail(id, function(err, post) {
		if (err) {
			callback(err);
		} else {
			callback(null, post);
		}
	});
}

exports.getSingleUserByEmail = function(mail, callback) {
	UserModel.findOne({
		mail: mail
	}, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	})
}

exports.getSingleUserByName = function(name, callback) {
	UserModel.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	})
}


exports.updateAuth = function(user, callback) {
		var timestamp=new Date().getTime();
		var auth=createAuth(user.name,user.token,timestamp)
		user.auth = auth;
		user.login_time=timestamp;
		user.save(function(err) {
			if (err) {
				callback(err);
			} else {
				callback(null,auth);
			}
		});
}

exports.updateToken = function(user,token, callback) {
		var token=token;
		user.token = token;
		user.save(function(err) {
			if (err) {
				callback(err);
			} else {
				callback(null,token);
			}
		});
}

function createAuth(username,token,timestamp) {
	var key = util.Config.get('login_secret').LOGIN_AUTH_SECRET;
	var text = token.substring(0,16)+username+token.substring(16)+timestamp;
	return util.Crypto.sha512(text, key,'base64');
}