exports.get = function(name) {
  var constant = {

    "APPLY_CERTIFICATE_TIMEOUT": 60 * 15 * 1000,
    "ARTICLE_STATUS_DELETE": -1,
    "ARTICLE_STATUS_DRAFT": 0,
    "ARTICLE_STATUS_RELEASE": 1,
    "CERTIFICATE_KEY_START": 0,
    "CERTIFICATE_KEY_MID": 16,
    "CERTIFICATE_KEY_GROUP_NUMS": 8,
    "CERTIFICATE_KEY_GROUP_START": 0,
    "CERTIFICATE_KEY_GROUP_MID": 2,
    "LOGIN_TIMEOUT": 60 * 60 * 2 * 1000,
    "LOGIN_CERTIFICATE_LENGTH": 2,
    "PAGE_SIZE": 2,
    "STANDARD_START": 0,
    "RANDOM_START": 899999,
    "RANDOM_OFFSET": 100000,
    "RANDOM_MIN_START": 8999,
    "RANDOM_MIN_OFFSET": 1000,


    "ERROR_ARTICLE_NOT_FOUND_CODE": 5,
    "ERROR_ARTICLE_SAVE_FAIL_CODE": 6,
    "ERROR_ARTICLE_AUTHORIZED_EDIT_FAIL_CODE": 7,
    "ERROR_LOGIN_USER_TIMEOUT_CODE": 3,
    "ERROR_LOGIN_USER_VERIFT_FAIL_CODE": 4,
    "ERROR_USER_AUTHORIZED_EDIT_FAIL_CODE": 8,
    "ERROR_USER_SAVE_FAIL_CODE": 9

  };
  return constant[name];
};