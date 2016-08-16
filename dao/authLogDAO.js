var AuthLogModel = require('../models/db').AuthLog;
var util = require('../util');

exports.getAuthLogByToken = function(token, callback) {
  AuthLogModel.findOne({
    token: token
  }, function(err, auth_log) {
    if (err) {
      return callback(err);
    }
    callback(null, auth_log);
  });
};

exports.saveAuth = function(user, is_tmp, callback) {
  var timestamp = new Date().getTime();
  var token = user.mail + timestamp + (Math.round(Math.random() * util.Constant.get('RANDOM_MIN_START')) + util.Constant.get('RANDOM_MIN_OFFSET')) + "";
  var key = util.Config.get('login_secret').APPLY_AUTH_SECRET;
  token = util.Crypto.sha512(token, key, 'hex');
  token = util.Crypto.md5(token);
  var salt = Math.round(Math.random() * util.Constant.get('RANDOM_START')) + util.Constant.get('RANDOM_OFFSET');
  var authLogModel = new AuthLogModel();
  authLogModel.token = token;
  authLogModel.salt = salt;
  authLogModel.apply_time = timestamp;
  authLogModel.mail = user.mail;
  authLogModel.username = user.name;
  authLogModel.is_tmp = is_tmp;
  authLogModel.save(function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, token, salt);
    }
  });
};