(function() {
  'use strict';

  var SERVICE_PATH = {
    LIST: "api/article/list?tag=:tag&author=:author&page=:page",
    ARTICLE: "api/article/:id",
    AUTHOR: "dummy/author/:id.json",
  }; //API URL

  var blogServices = angular.module('blogServices', ['ngResource']);

  //消息服务
  // blogServices.factory('blogMessage', function($log) {
  //     var msgQueue = [];
  //     var log = function(msg) {
  //         $log.log(msg);
  //         return msgQueue.push(msg);
  //     }
  //     return {
  //         count: function() {
  //             return msgQueue.length;
  //         },
  //         get: function() {
  //             return msgQueue.shift();
  //         },
  //         log: log,
  //         error: function(status) {
  //             var msg = "";
  //             switch (status) {
  //                 case 404:
  //                     msg = "页面未找到";
  //                     break;
  //                 case 500:
  //                     msg = "网站出错";
  //                     break;
  //                 default:
  //                     msg = "出错了";
  //                     break;
  //             }
  //             return this.log(msg);
  //         }
  //     }
  // });

  //List接口
  blogServices.factory('blogList', function($resource, nProgress) {
    return {
      get: function(params, page, callback) {
        nProgress.start();
        params.page = page || 1;
        return $resource(SERVICE_PATH.LIST, {
          tag: '@tag',
          author: '@author',
          keyword: '@keyword',
          page: '@page'
        }).get(params, callback, function(response) {
          // blogMessage.error(response.status);
          nProgress.done();
        });
      }
    };
  });

  //Article接口
  blogServices.factory('blogArticle', function($resource) {
    var res = $resource(SERVICE_PATH.ARTICLE, {}, {
      view: {
        method: "GET",
        params: {
          id: "@id"
        }
      }
    });
    return {
      view: function(id, callback) {
        var params = {
          id: id
        };
        return res.view(params, callback, function(response) {
          // blogMessage.error(response.status);
        });
      }
    };
  });

  //Author接口
  blogServices.factory('blogAuthor', function($resource) {
    var res = $resource(SERVICE_PATH.AUTHOR, {
      id: "@id"
    });
    return {
      get: function(id) {
        var params = {
          id: id
        };
        return res.get(params, null, function(response) {
          // blogMessage.error(response.status);
        });
      }
    };
  });

  //NProgress插件封装
  blogServices.factory('nProgress', function() {
    var start = function() {
      NProgress.start();
    };

    var done = function() {
      NProgress.done();
      NProgress.remove();
    };

    return {
      start: start,
      done: done
    };

  });
}());