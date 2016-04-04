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
    
blogController.controller('ArticleController',['$rootScope','$scope','$location','$routeParams','Article','$log',
    function ($rootScope,$scope,$location,$routeParams,Article,$log) {
        var action = $routeParams.action;
        var articleId = $routeParams.articleId;
        if(articleId == null && (action == "edit" || action == "delete" || action == null)){
            $location.path("/home");
        }
        if(articleId && articleId != "" && /^[A-Za-z0-9]+$/.test(articleId) || action == "add"){
            switch(action){
                case "delete" : 
                    Article.delete({articleId:articleId},function (success) {
                        $location.path("/home");
                    },function(error){
                        $location.path("/home");
                    });
                    break;
                case "edit" : 
                    Article.edit({articleId:articleId},function(data){
                        $rootScope.title = "编辑:"+data.title;
                        $scope.articleTitle = data.title;
                        $scope.articleText = data.text;
                    });
                    $scope.save = function(){
                        Article.save({articleId:articleId},{title:$scope.articleTitle,text:$scope.articleText},function (data) {
                            $location.path("/article/{{data}}");
                        },function (error) {
                            //exception
                        });
                    }
                    break;
                case "add" :
                    $rootScope.title = "新建文章";
                    $scope.articleTitle = "新建文章";
                    $scope.articleText = "";
                    $scope.save = function(){
                        Article.save({articleId:""},{title:$scope.articleTitle,text:$scope.articleText},function (data) {
                            $location.path("/article/{{data}}");
                        },function (error) {
                            //exception
                        });
                    }
                    break;
                default : 
                    Article.view({articleId:articleId},function(data){
                        $rootScope.title = data.title;
                        $scope.title = data.title;
                        $scope.text = data.text;
                        $scope.author = data.author;
                    });
            };
        }else{
            $location.path("/home");
        }
    }])

blogController.controller('ErrorController',['$rootScope','$scope','$routeParams',
    function ($rootScope,$scope,$routeParams) {
        $rootScope.title = "出错啦！";
        $scope.status = $routeParams.errorCode;
    }]);