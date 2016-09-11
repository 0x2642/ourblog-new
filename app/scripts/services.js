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
      if (response.data.error_code) {
        console.error(response.data);
        return $q.reject(response.data.msg);
      }
      return response.data;
    }

    function getExceptionData(response) {
      if (typeof response === 'string') {
        return $q.reject(response);
      } else {
        return $q.reject('服务器出现异常');
      }
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
      return $http.get(SERVICE_PATH.LIST, config).then(getResponseData).catch(getExceptionData);
    };

    var getArticle = function(aid) {
      return $http.get(SERVICE_PATH.ARTICLE + '/' + aid).then(getResponseData).catch(getExceptionData);
    };

    var getAuthor = function(uid) {
      return $http.get(SERVICE_PATH.AUTHOR + '/' + uid).then(getResponseData).catch(getExceptionData);
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
      NProgress.set(0.4);
    };

    var done = function() {
      NProgress.done();
    };

    return {
      start: start,
      done: done
    };

  });

  blogServices.factory('MessageService', function($state) {
    var query = [];
    var getQueryLength = function() {
      return query.length;
    };

    var pop = function() {
      return query.pop();
    };

    var push = function(value) {
      return query.push(value);
    };

    var redirectTo = function(route) {
      if (!route) {
        route = 'home';
      }
      return $state.go(route);
    };

    return {
      getQueryLength: getQueryLength,
      pop: pop,
      push: push,
      redirectTo: redirectTo
    };

  });
}());