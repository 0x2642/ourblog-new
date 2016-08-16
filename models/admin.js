var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AdminSchame = new Schema({

  // Admin user name
  username: {
    type: String
  },

  // Admin user password
  password: {
    type: String
  },

  // Admin email
  email: {
    type: String
  },

  // Admin registor time
  add_time: {
    type: Date
  },

  // Admin authority
  level: {
    type: Number
  },

  // AddClass exp
  exp: {
    type: Number
  },

  // Admin's comments
  comments: {
    type: [String]
  },

  // Is admin online
  is_online: {
    type: Boolean
  }

}, {
  collection: 'admin'
});

mongoose.model('Admin', AdminSchame);