/// <reference path="../typings/tsd.d.ts" />
'use strict';

var blogFilters = angular.module('blogFilters', []);

blogFilters.filter('action', function() {
  return function(input) {
    return input=="edit"?"编辑":input=="delete"?"删除":input;
  };
});