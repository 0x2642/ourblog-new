'use strict';

var app = angular.module('ourblog', [
  'ui.router',
  'blogController',
  'blogServices',
  'blogDirective',
  'blogFilters'
])

.config(function($stateProvider, $urlRouterProvider) {

  // $urlRouterProvider.interceptors.push(function($injector, $q) {
  //   return {
  //     responseError: function(response) {
  //       console.log('response error');
  //       var $state = $injector.get('state');
  //       if (response.state === 404 && $state.current !== 'home') {
  //         $state.go('^');
  //       }
  //       return $q.reject(response);
  //     }
  //   }
  // });

  $urlRouterProvider.otherwise('home');

  var listView = {
    'content': {
      controller: 'ListController',
      templateUrl: 'views/list.html'
    }
  }

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'main': {
          controller: 'HomeController',
          templateUrl: 'views/main.html'
        }
      }
    })
    .state('tag', {
      url: '/tag／:tid',
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
    })


});