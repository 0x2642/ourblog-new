(function() {
  'use strict';

  var app = angular.module('ourblog', [
    'ui.router',
    'blogController',
    'blogServices',
    'blogDirective',
    'blogFilters'
  ])

  .run(function() {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    var listView = {
      'content': {
        controller: 'ListController',
        templateUrl: 'views/list.html'
      }
    };

    $stateProvider
      .state('home', {
        url: '/',
        views: listView
      })
      .state('tag', {
        url: '/tag/:tid',
        views: listView
      })
      .state('author', {
        url: '/author/:uid',
        views: listView
      })
      .state('search', {
        url: '/search/:text',
        views: listView
      })
      .state('article', {
        url: '/article/:aid',
        views: {
          'content': {
            controller: 'ArticleController',
            templateUrl: 'views/article.html'
          }
        }
      });
  });
}());