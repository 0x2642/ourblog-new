'use strict';

var app = angular.module('ourblog', ['ngRoute','blogController','blogServices','blogDirective','blogFilters']);
app.config(function ($routeProvider) {
    var blogList = {
        controller: 'ListController',
        templateUrl: 'views/list.html'
    };
    var article = {
        controller: 'ArticleController',
        templateUrl: 'views/article.html'
    }
    
    $routeProvider
    .when('/',blogList)
    .when('/tag/:tag',blogList)
    .when('/author/:author',blogList)
    .when('/search/:text',blogList)
    .when('/article/:id',article)
    // .when('/article/:articleId',{
    //     controller: "ArticleController",
    //     templateUrl: "views/article.html"
    // })
    // .when('/article/:articleId?\/:action?',{
    //     controller: "ArticleController",
    //     templateUrl: "views/edit.html"
    // })
    .otherwise({
        redirectTo: '/'
    });
});