/// <reference path="../typings/tsd.d.ts" />
/// <reference path="app.js" />
/// <reference path="services.js" />
'use strict';

var blogController = angular.module('blogController',[]);

blogController.controller('HomeController',['$rootScope','$scope','ArticleList',
    function ($rootScope,$scope,ArticleList) {
        var getList = function(pageNum){
            ArticleList.get({page:pageNum},function (data) {
                $rootScope.title = data.title;
                if(pageNum == 1){
                    $scope.top = data.top;
                }
                $scope.articles = data.articles;
                $scope.pagenation = data.pagenation;
            });            
        }
        getList(1);
        $scope.next = function(){
            var pagenation = $scope.pagenation;
            if(pagenation.current < pagenation.max){
                getList(parseInt(pagenation.current+1));
            }
        }
        $scope.previous = function(){
            var pagenation = $scope.pagenation;
            if(pagenation.current > 1){
                getList(parseInt(pagenation.current-1));
            }
        }
    }]);
    
blogController.controller('ListController',['$rootScope','$scope','$location','$routeParams','ArticleList',
    function($rootScope,$scope,$location,$routeParams,ArticleList){
        var getList = function(pageNum){
            ArticleList.get({tagId:$routeParams.tagId,page:pageNum},function (data) {
                $rootScope.title = data.title;
                $scope.tagInfo = data.tagInfo;
                $scope.articles = data.articles;
                $scope.pagenation = data.pagenation;
            },function (error) {
                $location.path("/error/"+error.status);
            });
        }
        getList(1);
        $scope.next = function(){
            var pagenation = $scope.pagenation;
            if(pagenation.current < pagenation.max){
                getList(parseInt(pagenation.current+1));
            }
        }
        $scope.previous = function(){
            var pagenation = $scope.pagenation;
            if(pagenation.current > 1){
                getList(parseInt(pagenation.current-1));
            }
        }
    }]);
    
blogController.controller('PostController',['$rootScope','$scope','$location','$routeParams','Article',
    function ($rootScope,$scope,$location,$routeParams,Article) {
        
    }])

blogController.controller('ErrorController',['$rootScope','$scope','$routeParams',
    function ($rootScope,$scope,$routeParams) {
        $rootScope.title = "出错啦！";
        $scope.status = $routeParams.errorCode;
    }]);