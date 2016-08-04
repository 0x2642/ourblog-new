/*
 * Post model, 是否考虑加入base model需要验证
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AdminSchame = new Schema({
	
	username: {
		type: String  // Admin user name
	},

	password: {
		type: String  // Admin user password
	},
	
	email: {
		type: String  // Admin email
	},
	
	add_time: {
		type: Date
	},

	level: {
		type: Number
	}
}, {
	collection: 'admin'
});

mongoose.model('Admin', AdminSchame);