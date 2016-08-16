var crypto = require('crypto');

exports.md5 = function(text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

exports.base64 = function(text) {
  return new Buffer(text).toString('base64');
};

exports.sha512 = function(text, key, output) {
  return crypto.createHmac('sha512', key).update(text).digest(encoding = output);
};