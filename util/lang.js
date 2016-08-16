exports.get = function(name) {
  var lang = {

    "ARTICLE_STATUS": {
      '-1': '删除',
      '0': '草稿',
      '1': '发布',
    },

    "NAV_LIST": {
      "INDEX": "Index",
      "ARTICLE": "Article",
      "USER": "User",
      "EXPORT": "Export",
    },


    "SUCCESS_LOGIN": "登录成功",
    "SUCCESS_ARTICLE_SAVE": "文章保存成功",
    "SUCCESS_USER_SAVE": "用户保存成功",

    "ERROR_LOGIN_USER_NOT_EXIST": "用户不存在",
    "ERROR_LOGIN_CERTIFICATE_ILLEGAL": "证书非法",
    "ERROR_LOGIN_USER_VERIFT_FAIL": "用户验证失败",
    "ERROR_LOGIN_USER_TIMEOUT": "用户登录超时",
    "ERROR_LOGIN_FAIL": "登录失败",
    "ERROR_APPLY_AUTHORIZED_FAIL": "申请授权失败",
    "ERROR_APPLY_AUTHORIZED_USER_NOT_EXIST": "你tm不是我们组织的",
    "ERROR_APPLY_AUTHORIZED_TOKEN_ILLEGAL": "申请授权Token非法",
    "ERROR_APPLY_AUTHORIZED_CODE": "授权码错误",
    "ERROR_APPLY_AUTHORIZED_TIMEOUT": "申请授权超时",
    "ERROR_ARTICLE_NOT_FOUND": "文章未找到",
    "ERROR_ARTICLE_SAVE_FAIL": "文章更新失败",
    "ERROR_ARTICLE_AUTHORIZED_EDIT_FAIL": "该文章未有修改授权",
    "ERROR_USER_NOT_FOUND": "用户未找到",
    "ERROR_USER_SAVE_FAIL": "用户更新失败",
    "ERROR_USER_AUTHORIZED_EDIT_FAIL": "该用户未有修改授权",


    "MAIL_APPLY_AUTHORIZED_SUBJECT": "您正在申请授权",
    "MAIL_APPLY_AUTHORIZED_TPL": "您已经开始申请授权，授权码是{%code%}<br/>请点击以下网址<a href='{%url%}'>{%url%}</a>来获取授权文件。如非本人操作请及时登录后台修改授权码。",




  };
  return lang[name];
};