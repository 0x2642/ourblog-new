var ArticleModel = require('../models/db').Article;
var util = require('../util');
var PAGE_SIZE = util.Constant.get('PAGE_SIZE');

// 共同方法，根据post的id查找对应的post
function getArticleDetail(post_id, callback) {
  ArticleModel.findOne({
    _id: post_id
  }, callback);
}


function getListCount(query, callback) {
  ArticleModel.find(query).count({}, callback);
}

/**
 * 根据关键词，获取文章列表
 * Callback:
 * - err, 数据库错误
 * - posts, 文章列表
 * @param {String} query 搜索关键词
 * @param {Object} option 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getArticleList = function(query, fields, option, sort, callback) {
  fields = fields || {};
  option = option || {
    "skip": 0,
    "limit": PAGE_SIZE
  };
  sort = sort || {
    '_id': -1
  };

  getListCount(query, function(err, count) {

    if (count === 0)
      return callback(null, [], 0);

    ArticleModel.find(query, fields, option, function(err, articles) {
      if (err) {
        return callback(err);
      }
      if (articles.length === 0) {
        return callback(null, [], count);
      }
      callback(null, articles, count);
    }).sort(sort);

  });
};


/**
 * 根据用户Email获取用户所有文章列表
 * Callback:
 * - err, 数据库错误
 * - posts, 该用户的所有文章列表
 * @param {String} email email用户所有的文章
 * @param {Function} callback 回调函数
 */
exports.getArticleByEmail = function(email, callback) {
  // 异常Case考虑：如果不存在email, 则返回空
  if (!email) {
    callback(null, null);
  } else {
    ArticleModel.find({
      mail: email
    }, function(err, posts) {
      if (err) {
        return callback(err);
      }
      if (!posts) {
        return callback(err, null);
      }
      callback(null, posts);
    });
  }
};

/**
 * 根据id来寻找一篇文章
 * Callback:
 * - err, 数据库错误
 * - post, 匹配到的文章
 * @param {String} id 文章的id
 * @param {Function} callback 回调函数
 */
exports.getSingleArticleById = function(id, callback) {
  getArticleDetail(id, function(err, post) {
    if (err) {
      callback(err);
    } else {
      callback(null, post);
    }
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
  getArticleDetail(id, function(err, article) {
    if (err) {
      callback(err);
    }
    article.status = util.Constant.get('ARTICLE_STATUS_DELETE');
    article.save(function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  });
};


exports.save = function(artistInfo, callback) {

  if (artistInfo._id) {
    getArticleDetail(artistInfo._id, function(err, article) {
      if (err) {
        callback(err);
      }

      article.title = artistInfo.title;
      article.description = artistInfo.description;
      article.thumb = artistInfo.thumb;
      article.status = artistInfo.status;
      article.title = artistInfo.title;
      article.tags = artistInfo.tags;
      article.content = artistInfo.content;

      article.save(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    });
  } else {
    var articleModel = new ArticleModel();
    articleModel.author = artistInfo.author;
    articleModel.title = artistInfo.title;
    articleModel.description = artistInfo.description;
    articleModel.content = artistInfo.content;
    articleModel.thumb = artistInfo.thumb;
    articleModel.status = artistInfo.status;
    articleModel.tags = artistInfo.tags;
    articleModel.save(callback);
  }

};