var express = require('express');
var router = express.Router();
var dao = require('../dao/indexDAO.js');
var util = require('../util');
var Article = dao.Article;
var User = dao.User;

//article list API
router.get('/article/list', function(req, res, next) {
  var page = req.query.page || 1;
  var pagesize = req.query.pagesize || util.Constant.get('PAGE_SIZE');
  var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
  var is_auth = req.query.is_auth || 0;

  var searchList = {
    'tag': 'String',
    'author': 'String',
    'keyword': 'String',
  };

  for (var key in searchList) {
    if (req.param(key)) {
      searchList[key] = new RegExp(util.Strings.filter(req.param(key), searchList[key]));
    } else {
      delete searchList[key];
    }
  }

  page = Math.abs(page - 1);
  var option = {
    "skip": page * pagesize,
    "limit": parseInt(pagesize)
  };

  if (auth && is_auth > 0) {

    User.getSingleUserByAuth(auth, function(err, user) {

      if (err) {
        res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
      } else {
        var time_now = new Date().getTime();
        if (user !== null) {
          if (time_now - user.login_time > util.Constant.get('LOGIN_TIMEOUT')) {
            res.send(getErrorString('ERROR_LOGIN_USER_TIMEOUT'));
          } else {
            if (!user.is_admin || user.is_admin != 1)
              searchList['author.id'] = user._id + "";
            searchList.status = {
              "$gte": util.Constant.get('ARTICLE_STATUS_DRAFT')
            };
            console.log(searchList);
            getArticleList(searchList, option, page, pagesize, res);
          }
        } else {
          res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
        }
      }
    });

  } else {
    searchList.status = util.Constant.get('ARTICLE_STATUS_RELEASE');
    getArticleList(searchList, option, page, pagesize, res);
  }

});

//article API
router.route('/article/:articleId')

.all(function(req, res, next) {
  //TODO something for all action,like exist check
  console.log(req.params.articleId);
  req.articleId = req.params.articleId || -1; //TODO more check needed
  next();
})

.get(function(req, res, next) {
  id = req.articleId;
  Article.getSingleArticleById(id, function(err, article) {
    if (err) {
      res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'));
    } else {
      if (article !== null) {
        res.send(article);
      } else {
        res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'));
      }
    }
  });
})

.post(function(req, res, next) {
  var post_info = req.body;
  var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
  post_info.tags = post_info.tags.replace(/,|，/g, ",").split(',');
  post_info.content = post_info['content-markdown-doc'];
  if (auth) {
    User.getSingleUserByAuth(auth, function(err, user) {
      if (err) {
        res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
      } else {
        author = {
          'id': user._id.toString(),
          'name': user.name
        };
        post_info.author = author;

        checkUser(post_info, user, res, function(err) {
          Article.save(post_info, function(err) {
            if (err) {
              res.send(getErrorString('ERROR_ARTICLE_SAVE_FAIL'));
            } else {
              res.send(getSuccessString('SUCCESS_ARTICLE_SAVE'));
            }
          });
        });
      }
    });
  } else {
    res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
  }
})

.put(function(req, res, next) {
  //TODO
  next(new Error('not implemented'));
})

.delete(function(req, res, next) {
  var id = req.articleId;
  var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
  if (auth) {
    User.getSingleUserByAuth(auth, function(err, user) {
      if (err) {
        res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
      } else {
        author = {
          'id': user._id.toString(),
          'name': user.name
        };
        var post_info = {};
        post_info.author = author;
        post_info._id = id;

        checkUser(post_info, user, res, function(err) {
          Article.del(id, function(err) {
            if (err) {
              res.send(getErrorString('ERROR_ARTICLE_SAVE_FAIL'));
            } else {
              res.send(getSuccessString('SUCCESS_ARTICLE_SAVE'));
            }
          });
        });

      }
    });
  } else {
    res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
  }
});


//user list api
router.get('/user/list', function(req, res, next) {
  var page = req.query.page || 1;
  var pagesize = req.query.pagesize || util.Constant.get('PAGE_SIZE');

  var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');

  page = Math.abs(page - 1);
  var option = {
    "skip": page * pagesize,
    "limit": parseInt(pagesize)
  };

  if (auth) {
    User.getSingleUserByAuth(auth, function(err, user) {
      if (err) {
        res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
      } else {
        if (user.is_admin && user.is_admin == 1) {
          User.getUserList({
            status: "1"
          }, '', option, '', function(err, data, count) {
            var ret = {
              "users": data,
              "pagenation": {
                "current": page + 1,
                "max": Math.ceil(count / pagesize)
              }
            };
            res.send(ret);
          });
        } else {
          User.getUserList({
            status: "1",
            _id: user._id
          }, '', option, '', function(err, data, count) {
            var ret = {
              "users": data,
              "pagenation": {
                "current": page + 1,
                "max": Math.ceil(count / pagesize)
              }
            };
            res.send(ret);
          });
        }
      }
    });
  } else {
    res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
  }
});

//user API
router.route('/user/:userId')

.all(function(req, res, next) {
  console.log(req.params.userId);
  next();
})

.get(function(req, res, next) {
  id = req.params.userId || 1;
  User.getSingleUserById(id, function(err, user) {
    if (err) {
      res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'));
    } else {
      if (user !== null) {
        var del_list = ['token', 'auth', 'login_time'];
        for (var i = del_list.length - 1; i >= 0; i--) {
          if (user[del_list[i]])
            user[del_list[i]] = undefined;
        }
        res.send(user);
      } else {
        res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'));
      }
    }
  });
})

.post(function(req, res, next) {
  var post_info = req.body;
  var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
  if (auth) {
    User.getSingleUserByAuth(auth, function(err, user) {
      if (err) {
        res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
      } else {
        if (!user.is_admin || user.is_admin != 1) {
          if (user._id != post_info._id) {
            res.send(getErrorString('ERROR_USER_AUTHORIZED_EDIT_FAIL'));
          } else {
            User.save(post_info, function(err) {
              if (err) {
                res.send(getErrorString('ERROR_USER_SAVE_FAIL'));
              } else {
                res.send(getSuccessString('SUCCESS_USER_SAVE'));
              }
            });
          }
        } else {
          User.save(post_info, function(err) {
            if (err) {
              res.send(getErrorString('ERROR_USER_SAVE_FAIL'));
            } else {
              res.send(getSuccessString('SUCCESS_USER_SAVE'));
            }
          });
        }
      }
    });
  } else {
    res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
  }
})

.put(function(req, res, next) {
  //TODO
})

.delete(function(req, res, next) {
  var id = req.body.id;
  console.log(id);
  var auth = req.query.auth || util.Cookies.getCookie(req, 'auth');
  if (auth) {
    User.getSingleUserByAuth(auth, function(err, user) {
      if (err) {
        res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
      } else {
        if (!user.is_admin || user.is_admin != 1) {
          if (user._id != id) {
            res.send(getErrorString('ERROR_USER_AUTHORIZED_EDIT_FAIL'));
          } else {
            User.del(id, function(err) {
              if (err) {
                res.send(getErrorString('ERROR_USER_SAVE_FAIL'));
              } else {
                res.send(getSuccessString('SUCCESS_USER_SAVE'));
              }
            });
          }
        } else {
          User.del(id, function(err) {
            if (err) {
              res.send(getErrorString('ERROR_USER_SAVE_FAIL'));
            } else {
              res.send(getSuccessString('SUCCESS_USER_SAVE'));
            }
          });
        }

      }
    });
  } else {
    res.send(getErrorString('ERROR_LOGIN_USER_VERIFT_FAIL'));
  }
});

//author API
router.route('/author/:userId')

.get(function(req, res, next) {
  //TODO
  next(new Error('not implemented'));
});

//common
function getArticleList(searchList, option, page, pagesize, res) {
  Article.getArticleList(searchList, '', option, '', function(err, data, count) {
    var ret = {
      "articles": data,
      "pagenation": {
        "current": page + 1,
        "max": Math.ceil(count / pagesize)
      }
    };
    res.send(ret);
  });
}

function checkUser(post_info, user, res, callback) {

  if (post_info._id && (!user.is_admin || user.is_admin != 1)) {

    Article.getSingleArticleById(post_info._id, function(err, article) {
      if (err) {
        res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'));
      } else {
        if (article !== null) {
          if (article.author.id == post_info.author.id) {
            callback(null);
          } else {
            res.send(getErrorString('ERROR_ARTICLE_AUTHORIZED_EDIT_FAIL'));
          }
        } else {
          res.send(getErrorString('ERROR_ARTICLE_NOT_FOUND'));
        }
      }
    });
  } else {
    callback(null);
  }
}

function getErrorString(err_name) {
  return util.Strings.sendError2JSON(util.Lang.get(err_name), util.Constant.get(err_name + "_CODE"));
}

function getSuccessString(err_name) {
  return util.Strings.sendError2JSON(util.Lang.get(err_name), 0);
}

module.exports = router;