/*
 * Post model, 是否考虑加入base model需要验证
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArticleSchame = new Schema({

  author: {
    id: Number,
    name: String
  },

  title: {
    type: String // 文章标题
  },

  description: {
    type: String // 文章描述
  },

  // visitCount: Number,
  content: {
    type: String // 文章内容
  },

  createTime: {
    type: String,
    default: Date.now
  },

  thumb: {
    type: String
  },

  status: {
    type: Number
  },

  tags: {
    type: Array
  }
}, {
  collection: 'article'
});

mongoose.model('Article', ArticleSchame);