var fs = require('fs');

var CONFIG_PATH = './config.json';

var CONFIG_ENCODE = 'utf8';

var config = null;

exports.get = function(key) {
  if (!config) {
    loadConfig();
  }
  return config[key];
};

exports.getAll = function() {
  if (!config) {
    loadConfig();
  }
  return config;
};

exports.set = function(key, value) {
  config[key] = value;
};

exports.saveConfig = function() {
  var jsonStr = JSON.stringify(config, toJsonReplacer, 2);
  fs.writeFile(CONFIG_PATH, jsonStr, CONFIG_ENCODE, function(error) {
    if (error) {
      throw error;
    }
    console.log('Config Saved!');
  });
};

var loadConfig = function() {
  configStr = fs.readFileSync(CONFIG_PATH, CONFIG_ENCODE);
  config = JSON.parse(configStr);
};

var toJsonReplacer = function(key, value) {
  var val = value;
  if (typeof key === 'function') {
    val = undefined;
  }
  return val;
};