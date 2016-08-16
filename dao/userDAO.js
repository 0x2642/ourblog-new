var UserModel = require('../models/db').User;
var util = require('../util');
var PAGE_SIZE = util.Constant.get('PAGE_SIZE');

function getUserDetail(id, callback) {
  UserModel.findOne({
    _id: id
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
};

exports.getSingleUserByEmail = function(mail, callback) {
  UserModel.findOne({
    mail: mail
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

exports.getSingleUserByName = function(name, callback) {
  UserModel.findOne({
    name: name
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

exports.getSingleUserByAuth = function(auth, callback) {
  UserModel.findOne({
    auth: auth
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

exports.updateAuth = function(user, callback) {
  var timestamp = new Date().getTime();
  var auth = createAuth(user.name, user.token, timestamp);
  user.auth = auth;
  user.login_time = timestamp;
  user.save(function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, auth);
    }
  });
};

exports.updateToken = function(user, token, callback) {
  token = token;
  user.token = token;
  user.save(function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, token);
    }
  });
};

function createAuth(username, token, timestamp) {
  var key = util.Config.get('login_secret').LOGIN_AUTH_SECRET;
  var text = token.substring(util.Constant.get('CERTIFICATE_KEY_START'), util.Constant.get('CERTIFICATE_KEY_MID')) + username + token.substring(util.Constant.get('CERTIFICATE_KEY_MID')) + timestamp;
  return util.Crypto.sha512(text, key, 'base64');
}

function getListCount(query, callback) {
  UserModel.find(query).count({}, callback);
}


exports.getUserList = function(query, fields, option, sort, callback) {
  fields = fields || {};
  option = option || {
    "skip": 0,
    "limit": PAGE_SIZE
  };
  sort = sort || {
    '_id': -1
  };

  getListCount(query, function(err, count) {
    console.log(count);
    if (count === 0)
      return callback(null, [], 0);

    UserModel.find(query, fields, option, function(err, users) {
      if (err) {
        return callback(err);
      }

      if (users.length === 0) {
        return callback(null, [], count);
      }

      callback(null, users, count);

    }).sort(sort);

  });
};

/**
 * 删除一篇文章
 * Callback:
 * - err, 数据库错误
 * @param {String} id 文章的序号
 * @param {Function} callback 回调函数
 */
exports.del = function(id, callback) {
  getUserDetail(id, function(err, user) {
    if (err) {
      callback(err);
    }
    user.status = util.Constant.get('ARTICLE_STATUS_DELETE');
    user.save(function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  });
};


exports.save = function(userInfo, callback) {

  if (userInfo._id) {
    getUserDetail(userInfo._id, function(err, user) {
      if (err) {
        return callback(err);
      }

      user.mail = userInfo.mail;
      user.name = userInfo.name;
      user.avatar = userInfo.avatar;
      user.status = userInfo.status;
      user.description = userInfo.description;
      user.is_admin = userInfo.is_admin;


      user.save(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    });
  } else {
    var userModel = new UserModel();
    userModel.mail = userInfo.mail;
    userModel.name = userInfo.name;
    userModel.description = userInfo.description;
    userModel.avatar = userInfo.avatar;
    userModel.is_admin = userInfo.is_admin;
    userModel.status = userInfo.status;
    userModel.save(callback);
  }


};