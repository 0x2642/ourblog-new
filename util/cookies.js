/*
 *	2016年5月4日	Huajie
 *
 *	cookie操作
 */

exports.getCookie = function(req, name) {
  return req.cookies[name];
};

exports.setCookie = function(res, name, value, option) {
  option = option || {};
  res.cookie(name, value, option);
};

exports.delCookie = function(res, name, option) {
  option = option || {};
  res.clearCookie(name, option);
};