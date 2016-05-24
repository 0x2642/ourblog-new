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
	var fields = fields || {};
	var option = option || {
		"skip": 0,
		"limit": PAGE_SIZE
	};
	var sort = sort || {
		'_id': -1
	}

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
}

/**
 * 将文章存入数据库
 * @param {String} poster 作者
 * @param {Function} callback 回调函数
 */
exports.saveNewArticle = function(artistInfo, callback) {
	var ArticleModel = new ArticleModel();
	ArticleModel.author = artistInfo.author;
	ArticleModel.title = artistInfo.title;
	ArticleModel.description = artistInfo.description;
	ArticleModel.content = artistInfo.content;
	ArticleModel.createTime = artistInfo.createTime;
	ArticleModel.thumb = artistInfo.thumb;
	ArticleModel.status = artistInfo.status;
	ArticleModel.tags = artistInfo.tags;
	ArticleModel.save(callback);
}

/**
 * 根据用户Email获取用户所有文章列表
 * Callback:
 * - err, 数据库错误
 * - posts, 该用户的所有文章列表
 * @param {String} email email用户所有的文章
 * @param {Function} callback 回调函数
 */
exports.getPostsByEmail = function(email, callback) {
	// 异常Case考虑：如果不存在email, 则返回空
	if (!email) {
		callback(null, null);
	} else {
		ArticleModel.find({
			poster: email
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
}

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
}

/**
 * 修改一篇文章
 * Callback:
 * - err, 数据库错误
 * @param {String} newTitle 文章的新title
 * @param {String} newContents 文章的新newContents
 * @param {Function} callback 回调函数
 */
exports.updatePostById = function(id, newTitle, newContents, callback) {
	findThePost(id, function(err, post) {
		if (err) {
			callback(err);
		}

		post.title = newTitle;
		post.contents = newContents;

		post.save(function(err) {
			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});
	});
}

/**
 * 删除一篇文章
 * Callback:
 * - err, 数据库错误
 * @param {String} id 文章的序号
 * @param {Function} callback 回调函数
 */
exports.removePostById = function(id, callback) {
	findThePost(id, function(err, post) {
		if (err) {
			callback(err);
		}
		post.remove(function(err) {
			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});
	})
}