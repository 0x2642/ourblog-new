var AdminModel = require('../models/db').Admin;
var PAGE_SIZE = 100;

/**
 * Get Admin info by his/her email
 * Callback:
 * - err, db error
 * - admin, selected admin
 * @param {String} email query condition
 * @param {Function} callback callback function
 */
exports.getAdminByEmail = function(email, callback) {
  AdminModel.findOne({
    email: email
  }, function(err, admin) {
    if (err) {
      callback(err);
    }
    callback(null, admin);
  });
};

/**
 * Get all of admin's info
 * Callback:
 * - err, db error
 * - admins, all of admins
 * @param {String} query Keyword
 * @param {Object} option option
 * @param {Function} callback callback function
 */
exports.getAdminAll = function(query, fields, option, sort, callback) {
  var mFields = fields || {};
  var mFption = option || {
    "skip": 0,
    "limit": PAGE_SIZE
  };
  var mSort = sort || {
    '_id': -1
  };
  AdminModel.find(query, mFields, mFption, function(err, admins) {
    if (err) {
      return callback(err);
    }
    if (admins.length === 0) {
      return callback(null, []);
    }
    callback(null, admins);
  }).sort(mSort);
};

/**
 * Set a new admin
 * @param {Object} newAdmin A new admin info
 * @param {Function} callback callback function
 */
exports.setNewAdmin = function(newAdmin, callback) {
  var mAdminModel = new AdminModel();
  mAdminModel.username = newAdmin.username;
  mAdminModel.password = newAdmin.password;
  mAdminModel.email = newAdmin.email;
  mAdminModel.add_time = newAdmin.add_time;
  mAdminModel.level = newAdmin.level;
  mAdminModel.exp = 0;
  mAdminModel.comments = [];
  mAdminModel.is_online = false;
  mAdminModel.save(callback);
};

/**
 * Delete all admins
 * @param {Function} callback callback function
 */
exports.deleteAllAdmins = function(callback) {
  AdminModel.remove(callback);
};

/**
 * Delete one admins by mail
 * @param {Function} callback callback function
 */
exports.deleteCertainAdmins = function(email, callback) {
  AdminModel.remove({
    email: email
  }, callback);
};

/**
 * Update one admin's comment
 * @param {Function} callback callback function
 */
exports.updateOnline = function(email, bol, callback) {
  AdminModel.findOneAndUpdate({
    email: email
  }, {
    $set: {
      is_online: bol
    }
  }, callback);
};

/**
 * Update one admin's status
 * @param {Function} callback callback function
 */
exports.updateAdminStatus = function(email, key, value, callback) {
  var keyi = key;
  console.log(typeof(keyi));
  AdminModel.findOneAndUpdate({
    email: email
  }, {
    $set: {
      keyi: value
    }
  }, callback);
};