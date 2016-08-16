/*
 * Post model, 是否考虑加入base model需要验证
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AuthLogSchame = new Schema({
  mail: {
    type: String // 作者邮箱
  },
  apply_time: {
    type: String // 申请时间
  },
  username: {
    type: String // 用户名称
  },
  salt: {
    type: String // 授权码
  },
  token: {
    type: String // 用于加密的字符串
  },
  is_tmp: Number
}, {
  collection: 'auth_log'
});

mongoose.model('AuthLog', AuthLogSchame);