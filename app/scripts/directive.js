(function() {
    'use strict';

    var blogDirective = angular.module('blogDirective', []);

    blogDirective.directive('author', function() {
        return {
            restrict: 'E',
            scope: {
                uid: '='
            },
            templateUrl: 'directive/author.html'
        };
    });
}());