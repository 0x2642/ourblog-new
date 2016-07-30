'use strict';

var blogController = angular.module('blogController', ['ngSanitize'])

.controller('BlogController', function($rootScope, $scope) {
  $scope.pushTitle = function(newTitle) {
      $scope.pageTitle = newTitle;
    }
    //TODO get basic info, define search feature
})

.controller('ListController', function($rootScope, $scope, $routeParams, blogList) {
  var data = new Object();
  if ($routeParams.tag) {
    //tag
    $rootScope.title = $scope.meta = "#" + $routeParams.tag;
    data.tag = $routeParams.tag;
  } else if ($routeParams.author) {
    //author
    $rootScope.title = $scope.meta = "@" + $routeParams.author;
    data.author = $routeParams.author;
  } else if ($routeParams.text) {
    //search
    $rootScope.title = "搜索结果";
    $scope.meta = "搜索：" + text;
    var arr;
    arr = text.match(/(?:tag:|#)(\w+\b)/i); //匹配标签
    data.tag = arr && arr[1] || "";
    arr = text.match(/(?:^|\s+)([\w\u4e00-\u9fa5\u0800-\u4e00]+)(?:\s+|$)/i); //匹配关键词（中日英数）
    data.keyword = arr && arr[1] || "";
    arr = text.match(/(?:author:|@)(\w+\b)/i); //匹配作者
    data.author = arr && arr[1] || "";
  } else {
    //home
    $rootScope.title = $scope.meta = "主页";
  }
  var getList = function(page) {
    blogList.get(data, page, function(data) {
      $scope.articles = data.articles;
      $scope.pagenation = data.pagenation;
      if ($routeParams.author && data.articles && data.articles[0].author && data.articles[0].author.name) {
        $rootScope.title = $scope.meta = "@" + data.articles[0].author.name;
      }
    });
  }
  getList(); //init
  $scope.nextPage = function() { //上一页
    var pagenation = $scope.pagenation;
    if (pagenation && (pagenation.current < pagenation.max)) {
      getList(parseInt(pagenation.current + 1));
    }
  }
  $scope.previousPage = function() { //下一页
    var pagenation = $scope.pagenation;
    if (pagenation && (pagenation.current > 1)) {
      getList(parseInt(pagenation.current - 1));
    }
  }
})

.controller('ArticleController', function($rootScope, $scope, $routeParams, $location, $sce, blogArticle, blogMessage) {
  // 处理传入参数为实际变量
  var action, id;
  if ($routeParams.p1 == "add") {
    // 新建文章
    action = $routeParams.p1;
    $rootScope.title = "新建文章";
  } else if (/^\d+$/.test($routeParams.p1)) {
    id = $routeParams.p1;
    action = $routeParams.p2;
    if (action == "delete") {
      // 删除文章
      blogArticle.delete(id, function(result) {
        //TODO
      })
    } else {
      $scope.article = blogArticle.view(id, function(data) {
        $rootScope.title = data.title || "未找到文章";
        if (action) {
          // 编辑文章
          if (data && data.actions && data.actions.indexOf(action) >= 0) {
            $scope.tags = data.tags && data.tags.join(',') || "";
          } else {
            $location.path("/");
          }
        } else {
          // 查看文章
          var converter = new Markdown.Converter();
          $scope.text = $sce.trustAsHtml(converter.makeHtml(data.text));
        }
      });
    }
  } else {
    $location.path("/");
  }
  $scope.save = function() {
    $scope.article.tags = $scope.tags.split(',');
    blogArticle.save(id, $scope.article, function(result) {
      //TODO
    });
  }
})

.controller("AuthorController", function($scope, blogAuthor) {
  $scope.$watch(function() {
    return $scope.uid
  }, function() {
    if ($scope.uid) {
      $scope.author = blogAuthor.get($scope.uid);
    }
  });
});