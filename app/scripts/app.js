'use strict';

var app = angular.module('ourblog', ['ngRoute','blogController','blogServices','blogDirective','blogFilters']);
app.config(function ($routeProvider) {
    var blogList = {
        controller: 'ListController',
        templateUrl: 'views/list.html'
    };
    var article = {
        controller: 'ArticleController',
        templateUrl: function(ps){
            if(ps.p1=="add"||ps.p2=="edit"){
                return 'views/edit.html';
            }else{
                return 'views/article.html';
            }
        }
    }
    
    $routeProvider
    .when('/',blogList)
    .when('/tag/:tag',blogList)
    .when('/author/:author',blogList)
    .when('/search/:text',blogList)
    .when('/article/:p1/:p2?',article)
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