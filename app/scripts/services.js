'use strict';

var SERVICE_PATH = {
    LIST: "dummy/list/:tag/:author/:page.json",
    ARTICLE: "dummy/article/:id.json",
    AUTHOR: "",
    LOGIN: "",
    REGISTRY: ""
}//API URL

var blogServices = angular.module('blogServices', ['ngResource']);

//消息服务
blogServices.factory('blogMessage', ['$log',
    function ($log) {
        var msgQueue = [];
        var log = function (msg) {
            $log.log(msg);
            return msgQueue.push(msg);
        }
        return {
            count: function () {
                return msgQueue.length;
            },
            get: function () {
                return msgQueue.shift();
            },
            log: log,
            error: function (status) {
                var msg = "";
                switch (status) {
                    case 404: msg = "页面未找到"; break;
                    case 500: msg = "网站出错"; break;
                    default: msg = "出错了"; break;
                }
                return this.log(msg);
            }
        }
    }]);

//List接口
blogServices.factory('blogList', ['$resource', 'blogMessage',
    function ($resource, blogMessage) {
        return {
            get: function (params, page, callback) {
                params.page = page || 1;
                return $resource(SERVICE_PATH.LIST, {
                    tag: '@tag',
                    author: '@author',
                    keyword: '@keyword',
                    page: '@page'
                }).get(params, callback, function (response) {
                    blogMessage.error(response.status);
                });
            }
        }
    }]);

//Article接口
blogServices.factory('blogArticle', ['$resource', 'blogMessage',
    function ($resource, blogMessage) {
        var res = $resource(SERVICE_PATH.ARTICLE, {}, {
            view: { method: "GET", params: { id: "@id" } },
            save: { method: "POST" },
            delete: { method: "DELETE", params: { id: "@id" } }
        });
        return {
            view: function (id, callback) {
                var params = { id: id };
                return res.view(params, callback, function (response) {
                    blogMessage.error(response.status);
                });
            },
            save: function (id, data, callback) {
                var params = { id: id };
                return res.view(params, data, callback, function (response) {
                    blogMessage.error(response.status);
                });
            },
            delete: function (id, callback) {
                var params = { id: id };
                return res.view(params, callback, function (response) {
                    blogMessage.error(response.status);
                });
            }
        };
    }]);