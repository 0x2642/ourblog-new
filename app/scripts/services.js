(function() {
  'use strict';

  var blogServices = angular.module('blogServices', ['ngResource']);

  //BlogAPI Service
  blogServices.factory('blogAPI', function($http, $q) {
    var SERVICE_PATH = {
      LIST: "api/article/list",
      ARTICLE: "api/article",
      AUTHOR: "dummy/author",
    }; //API URL

    function getResponseData(response) {
      return response.data;
    }

    var getArticleList = function(searchKey, page) {
      var config = {
        params: {
          tag: searchKey.tag,
          author: searchKey.author,
          keyword: searchKey.keyword,
          page: page
        }
      };
      return $http.get(SERVICE_PATH.LIST, config).then(getResponseData);
    };

    var getArticle = function(aid) {
      return $http.get(SERVICE_PATH.ARTICLE + '/' + aid).then(getResponseData);
    };

    var getAuthor = function(uid) {
      return $http.get(SERVICE_PATH.AUTHOR + '/' + uid).then(getResponseData);
    };

    return {
      getArticleList: getArticleList,
      getArticle: getArticle,
      getAuthor: getAuthor
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