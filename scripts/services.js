/// <reference path="../typings/tsd.d.ts" />
'use strict';

var SERVICE_PATH = {
    ARTICLE_LIST : "dummy/list-:tagId-:page.json",
    ARTICLE : "dummy/article-:articleId.json"
}

var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('ArticleList', ['$resource',
    function ($resource) {
        return $resource(SERVICE_PATH.ARTICLE_LIST,{tagId:"all",page:1});
    }]);
    
blogServices.factory('Article',['$resource',
    function ($resource){
        return $resource(SERVICE_PATH.ARTICLE,{articleId:""},{
            view:{method:"GET"},
            edit:{method:"GET",params:{action:"edit"}},
            save:{method:"POST"},
            delete:{method:"DELETE"} 
        });
    }]);