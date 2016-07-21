var config = require('../config.js');

exports.get = function(conf) {
	return config[conf];
}

exports.set = function(conf,value) {
	
}