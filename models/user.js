/*
 * Post model, 是否考虑加入base model需要验证
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchame = new Schema({
  mail: {
    type: String // 作者邮箱
  },
  name: {
    type: String // 作者名称
  },
  avatar: {
    type: String // 头像链接
  },
  description: {
    type: String // 作者描述
  },
  // visitCount: Number,
  login_time: {
    type: String // 最后登录时间
  },
  status: {
    type: String
  },
  token: {
    type: String // 用于加密的字符串
  },
  auth: {
    type: String // 用于登录后的授权字符串
  },
  is_admin: {
    type: String // 是否具有管理员权限
  }
  // status: Number,
  // tags:Number
}, {
  collection: 'user'
});

mongoose.model('User', UserSchame);