/// <reference path="../typings/tsd.d.ts" />
/// <reference path="app.js" />
/// <reference path="controllers.js" />
'use strict';

// app.factory('HomeService',['$http',function($http){
//     return $http.get('dummy/home.json')
//         .success(function(data){
//             return data;
//         })
//         .error(function(err){
//             return err;
//         });
// }])
// .factory('ListService',['$http',function($http){
//     return function(tagId){
//         return $http.get(''+tagId)
//             .success(function(data){
//                 return data;
//             })
//             .error(function(err){
//                 return err;
//             });
//     }
// }])

var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('Homepage', ['$resource',
  function($resource){
    return $resource('/:phoneId.json', {}, {});
  }]);