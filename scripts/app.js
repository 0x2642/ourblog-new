/// <reference path="../typings/tsd.d.ts" />
'use strict';

var app = angular.module('ourblog', ['ngRoute','blogController','blogServices','blogDirective','blogFilters']);
app.config(function ($routeProvider) {
    $routeProvider
    .when('/home',{
        controller: 'HomeController',
        templateUrl: 'views/home.html'
    })
    .when('/tag/:tagId',{
        controller: "ListController",
        templateUrl: "views/list.html"
    })
    .when('/post/:postId',{
        controller: "PostController",
        templateUrl: "views/post.html"
    })
    .when('/post/:postId/:action',{
        controller: "PostController",
        templateUrl: "view/edit.html"
    })
    .when('/error/:errorCode',{
        controller: "ErrorController",
        templateUrl: "views/error.html"  
    })
    .otherwise({
        redirectTo: '/home'
    });
});