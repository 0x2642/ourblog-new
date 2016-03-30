/// <reference path="../typings/tsd.d.ts" />
/// <reference path="app.js" />
/// <reference path="controllers.js" />
'use strict';

var SERVICE_PATH = {
    ARTICLE_LIST : "dummy/list-:tagId-:page.json",
}

var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('ArticleList', ['$resource',
    function ($resource) {
        return $resource(SERVICE_PATH.ARTICLE_LIST,{tagId:"all",page:1});
    }])