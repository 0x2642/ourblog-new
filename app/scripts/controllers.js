(function() {
  'use strict';

  var blogController = angular.module('blogController', ['ngSanitize'])

  .controller('BlogController', function($scope, $state, MessageService) {

    //TODO: Initialize View

    $scope.updateTitle = function(newTitle) {
      $scope.pageTitle = newTitle + ' - 0x2642 Blog';
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

  .controller('ListController', function($scope, $stateParams, blogAPI, nProgress, MessageService) {

    var params = {};
    if ($stateParams.tid) {
      //tag
      $scope.meta = $scope.updateTitle('#' + $stateParams.tid);
      params.tag = $stateParams.tid;
    } else if ($stateParams.uid) {
      //author
      $scope.meta = $scope.updateTitle('@' + $stateParams.uid);
      params.author = $stateParams.uid;
    } else if ($stateParams.text) {
      //search
      $scope.updateTitle('搜索结果');
      $scope.meta = '搜索：' + $stateParams.text;
      var arr;
      arr = $stateParams.text.match(/(?:tag:|#)(\w+\b)/i); //匹配标签
      params.tag = arr && arr[1] || '';
      arr = $stateParams.text.match(/(?:^|\s+)([\w\u4e00-\u9fa5\u0800-\u4e00]+)(?:\s+|$)/i); //匹配关键词（中日英数）
      params.keyword = arr && arr[1] || '';
      arr = $stateParams.text.match(/(?:author:|@)(\w+\b)/i); //匹配作者
      params.author = arr && arr[1] || '';
    } else {
      //home
      $scope.meta = $scope.updateTitle('主页');
    }
    var getList = function(page) {
      nProgress.start();
      blogAPI.getArticleList(params, page)
        .then(function(data) {
          if (data.articles.length === 0) {
            MessageService.push('这里什么都没有！');
            MessageService.redirectTo();
          }
          $scope.articles = data.articles;
          $scope.pagenation = data.pagenation;
          if ($stateParams.uid && data.articles[0] && data.articles[0].author && data.articles[0].author.name) {
            $scope.meta = $scope.updateTitle('@' + data.articles[0].author.name);
          }
          return data;
        })
        .catch(function(msg) {
          MessageService.push(msg);
          MessageService.redirectTo();
        })
        .finally(function() {
          nProgress.done();
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

  .controller('ArticleController', function($scope, $stateParams, blogAPI, nProgress, MessageService) {
    nProgress.start();
    blogAPI.getArticle($stateParams.aid)
      .then(function(data) {
        if (data) {
          $scope.article = data;
          $scope.updateTitle(data.title);
          $scope.mdView = editormd && editormd.markdownToHTML('md-view', {
            markdown: data.content,
            htmlDecode: 'style,script,iframe', // you can filter tags decode
            emoji: true,
            taskList: true,
            tex: true, // 默认不解析
            flowChart: true, // 默认不解析
            sequenceDiagram: true, // 默认不解析
          });
        }
        return data;
      })
      .catch(function(msg) {
        MessageService.push(msg);
        MessageService.redirectTo();
      })
      .finally(function() {
        nProgress.done();
      });
  })

  .controller('AuthorController', function($scope, blogAPI) {
    $scope.$watch(function() {
      return $scope.uid;
    }, function() {
      if ($scope.uid) {
        blogAPI.getAuthor($scope.uid)
          .then(function(data) {
            $scope.author = data;
          });
      }
    });
  })

  .controller('MessageController', function($scope, MessageService, $timeout) {
    var messages = $scope.messages = [];

    $scope.isShow = false;

    $scope.$watch(MessageService.getQueryLength, function(value) {
      if (value > 0) {
        messages.push('出错啦！' + MessageService.pop());
        $scope.isShow = true;
        $timeout(5000).then(function() {
          $scope.isShow = false;
          messages.shift();
          if (messages.length > 0) {
            $scope.isShow = true;
          }
        });
      }
    });
  });
}());