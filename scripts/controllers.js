/// <reference path="../typings/tsd.d.ts" />
/// <reference path="app.js" />
/// <reference path="services.js" />
'use strict';

var blogController = angular.module('blogController',[]);
blogController.controller('HomeController',['$rootScope','$scope','HomeSerivce',function ($rootScope,$scope,HomeSerivce) {
    //var data = homeService;
    $rootScope.title = "Homepage";
    $scope.title = "HomoPage";
}]);
blogController.controller('ListController',['$rootScope','$scope','$routeParam','ListService',function($rootScope,$scope,$routeParam,ListService){
    $rootScope.title = $routeParam.tagId;
    $scope.title = "tagatag";
}]);
