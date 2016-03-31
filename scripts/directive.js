/// <reference path="../typings/tsd.d.ts" />
'use strict';

var blogDirective = angular.module('blogDirective',[]);

blogDirective.directive('article',function () {
    return {
        restrict:'E',
        scope:{
            info:'='
        },
        templateUrl:'directive/article.html'
    };
});
