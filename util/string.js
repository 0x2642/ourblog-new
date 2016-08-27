var filterFunctions = {
  'String': function(val) {
    return val.replace(/<[^>]+>/g, "").replace(/[^\w\u4e00-\u9fa5\u0800-\u4e00]/g, "");
  },
  'Integer': function(val) {
    val = parseInt(val);
    return isNaN(val) ? 0 : val;
  },
  'Float': function(val) {
    val = parseFloat(val);
    return isNaN(val) ? 0.0 : val;
  },
  'Pass': function(val) {
    return val;
  },

};

exports.filter = function(val, type) {
  return filterFunctions[type](val);
};

exports.sendError2JSON = function(msg, code) {
  return {
    error_code: code,
    msg: msg
  };
};