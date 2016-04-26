/// <reference path="app.js" />
/// <reference path="services.js" />
'use strict';

var blogController = angular.module('blogController',['ngSanitize']);
    
blogController.controller('ListController',['$rootScope','$scope','$routeParams','blogList',
    function($rootScope,$scope,$routeParams,blogList){
        var data = new Object();
        if($routeParams.tag){
            //tag
            $rootScope.title = $scope.meta = "#" + $routeParams.tag;
            data.tag = $routeParams.tag;
        }else if($routeParams.author){
            //author
            $rootScope.title = $scope.meta = "@" + $routeParams.author;
            data.author = $routeParams.author;
        }else if($routeParams.text){
            //search
            $rootScope.title = "搜索结果";
            $scope.meta = "搜索："+text;
            var arr;
            arr = text.match(/(?:tag:|#)(\w+\b)/i);//匹配标签
            data.tag = arr&&arr[1]||"";
            arr = text.match(/(?:^|\s+)([\w\u4e00-\u9fa5\u0800-\u4e00]+)(?:\s+|$)/i);//匹配关键词（中日英数）
            data.keyword = arr&&arr[1]||"";
            arr = text.match(/(?:author:|@)(\w+\b)/i);//匹配作者
            data.author = arr&&arr[1]||"";
        }else{
            //home
            $rootScope.title = $scope.meta = "主页";
        }
        var getList = function (page){
            blogList.get(data,page,function(data){
                $scope.articles = data.articles;
                $scope.pagenation = data.pagenation;
                if($routeParams.author&&data.articles&&data.articles[0].author&&data.articles[0].author.name){
                    $rootScope.title = $scope.meta = "@" + data.articles[0].author.name;
                }
            });
        }
        getList();//init
        $scope.nextPage = function(){//上一页
            var pagenation = $scope.pagenation;
            if(pagenation&&(pagenation.current < pagenation.max)){
                getList(parseInt(pagenation.current+1));
            }
        }
        $scope.previousPage = function(){//下一页
            var pagenation = $scope.pagenation;
            if(pagenation&&(pagenation.current >1)){
                getList(parseInt(pagenation.current-1));
            }
        }
    }]);
    
blogController.controller('ArticleController',['$rootScope','$scope','$routeParams','$sce','blogArticle',
    function($rootScope,$scope,$routeParams,$sce,blogArticle){
        var converter = new Markdown.Converter();
        $scope.article = blogArticle.view($routeParams.id,function(data){
            $rootScope.title = data.title; 
            $scope.text = $sce.trustAsHtml(converter.makeHtml(data.text));
        });
        $scope.save = function(){
            blogArticle.save($routeParams.id,$scope.data,function(data){});
        }
    }]);
// blogController.controller('ArticleController',['$rootScope','$scope','$location','$routeParams','Article','$log',
//     function ($rootScope,$scope,$location,$routeParams,Article,$log) {
//         var action = $routeParams.action;
//         var articleId = $routeParams.articleId;
//         if(articleId == null && (action == "edit" || action == "delete" || action == null)){
//             $location.path("/home");
//         }
//         if(articleId && articleId != "" && /^[A-Za-z0-9]+$/.test(articleId) || action == "add"){
//             switch(action){
//                 case "delete" : 
//                     Article.delete({articleId:articleId},function (success) {
//                         $location.path("/home");
//                     },function(error){
//                         $location.path("/home");
//                     });
//                     break;
//                 case "edit" : 
//                     Article.edit({articleId:articleId},function(data){
//                         $rootScope.title = "编辑:"+data.title;
//                         $scope.articleTitle = data.title;
//                         $scope.articleText = data.text;
//                     });
//                     $scope.save = function(){
//                         Article.save({articleId:articleId},{title:$scope.articleTitle,text:$scope.articleText},function (data) {
//                             $location.path("/article/{{data}}");
//                         },function (error) {
//                             //exception
//                         });
//                     }
//                     break;
//                 case "add" :
//                     $rootScope.title = "新建文章";
//                     $scope.articleTitle = "新建文章";
//                     $scope.articleText = "";
//                     $scope.save = function(){
//                         Article.save({articleId:""},{title:$scope.articleTitle,text:$scope.articleText},function (data) {
//                             $location.path("/article/{{data}}");
//                         },function (error) {
//                             //exception
//                         });
//                     }
//                     break;
//                 default : 
//                     Article.view({articleId:articleId},function(data){
//                         $rootScope.title = data.title;
//                         $scope.title = data.title;
//                         $scope.text = data.text;
//                         $scope.author = data.author;
//                     });
//             };
//         }else{
//             $location.path("/home");
//         }
//     }])

// blogController.controller('ErrorController',['$rootScope','$scope','$routeParams',
//     function ($rootScope,$scope,$routeParams) {
//         $rootScope.title = "出错啦！";
//         $scope.status = $routeParams.errorCode;
//     }]);