/// <reference path="../typings/tsd.d.ts" />
'use strict';

var app = angular.module('ourblog', ['ngRoute','blogController','blogServices']);
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
    .otherwise({
        redirectTo: '/home'
    });
});
