(function() {
  'use strict';

  var blogFilters = angular.module('blogFilters', []);

  blogFilters.filter('action', function() {
    return function(input) {
      return input == "edit" ? "编辑" : input == "delete" ? "删除" : input;
    };
  });

  blogFilters.filter('proper', function() {
    return function(input) {
      if (typeof(input) != "string") {
        return input;
      }
      var tmp = input.match(/^(?:[^\w\d])([a-z])\w+$/);
      return tmp && input.replace(tmp[1], tmp[1].toUpperCase()) || input;
    };
  });
}());