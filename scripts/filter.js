/// <reference path="../typings/tsd.d.ts" />
'use strict';

var blogFilters = angular.module('blogFilters', []);

blogFilters.filter('action', function() {
  return function(input) {
    return input=="edit"?"编辑":input=="delete"?"删除":input;
  };
});

// blogFilters.filter('proper', function () {
//   return function (input) {
//     if(/^\w+$/.test(input)){
//       return input.substring(0,1).toUpperCase+input.substring(1);
//     }else{
//       return input;
//     }
//   }
// });