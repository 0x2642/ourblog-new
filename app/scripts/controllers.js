(function() {
  'use strict';

  var blogController = angular.module('blogController', ['ngSanitize'])

  .controller('BlogController', function($scope, $state) {

    //TODO: Initialize View

    $scope.updateTitle = function(newTitle) {
      $scope.pageTitle = newTitle;
      return newTitle;
    };

    $scope.querySearch = function($event) {
      if ($event.keyCode == 13) {
        $state.go('search', {
          text: $scope.searchText
        });
      }
    };
  })

  .controller('ListController', function($scope, $stateParams, blogList) {

    var params = {};
    if ($stateParams.tid) {
      //tag
      $scope.meta = $scope.updateTitle("#" + $stateParams.tid);
      params.tag = $stateParams.tid;
    } else if ($stateParams.uid) {
      //author
      $scope.meta = $scope.updateTitle("@" + $stateParams.uid);
      params.author = $stateParams.uid;
    } else if ($stateParams.text) {
      //search
      $scope.updateTitle("搜索结果");
      $scope.meta = "搜索：" + $stateParams.text;
      var arr;
      arr = $stateParams.text.match(/(?:tag:|#)(\w+\b)/i); //匹配标签
      params.tag = arr && arr[1] || "";
      arr = $stateParams.text.match(/(?:^|\s+)([\w\u4e00-\u9fa5\u0800-\u4e00]+)(?:\s+|$)/i); //匹配关键词（中日英数）
      params.keyword = arr && arr[1] || "";
      arr = $stateParams.text.match(/(?:author:|@)(\w+\b)/i); //匹配作者
      params.author = arr && arr[1] || "";
    } else {
      //home
      $scope.meta = $scope.updateTitle("主页");
    }
    var getList = function(page) {
      blogList.get(params, page, function(data) {
        $scope.articles = data.articles;
        $scope.pagenation = data.pagenation;
        if ($stateParams.uid && data.articles && data.articles[0].author && data.articles[0].author.name) {
          $scope.meta = $scope.updateTitle("@" + data.articles[0].author.name);
        }
      });
    };
    getList(); //init

    $scope.nextPage = function() { //上一页
      var pagenation = $scope.pagenation;
      if (pagenation && (pagenation.current < pagenation.max)) {
        getList(parseInt(pagenation.current + 1));
      }
    };
    $scope.previousPage = function() { //下一页
      var pagenation = $scope.pagenation;
      if (pagenation && (pagenation.current > 1)) {
        getList(parseInt(pagenation.current - 1));
      }
    };
  })

  .controller('ArticleController', function($scope, $stateParams, $sce, blogArticle) {
    $scope.article = blogArticle.view($stateParams.aid, function(data) {
      $scope.updateTitle(data.title || "未找到文章");

      $scope.mdView = editormd && editormd.markdownToHTML("md-view", {
        markdown: data.content,
        htmlDecode: "style,script,iframe", // you can filter tags decode
        emoji: true,
        taskList: true,
        tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
      });

    });
  })

  .controller("AuthorController", function($scope, blogAuthor) {
    $scope.$watch(function() {
      return $scope.uid;
    }, function() {
      if ($scope.uid) {
        $scope.author = blogAuthor.get($scope.uid);
      }
    });
  });
}());