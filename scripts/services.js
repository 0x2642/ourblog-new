/// <reference path="../typings/tsd.d.ts" />
'use strict';

var SERVICE_PATH = {
    LIST : "dummy/list-:tagId-:page.json",
    ARTICLE : "dummy/article-:articleId.json",
    AUTHOR: "",
    LOGIN: "",
    REGISTRY: ""
}//API URL

var blogServices = angular.module('blogServices', ['ngResource']);

//消息服务
blogServices.factory('blogMessage',['$log',
    function ($log) {
        var msgQueue = [];
        var log = function (msg) {
            $log.log(msg);
            return msgQueue.push(msg);
        }
        return {
            count: function(){
                return msgQueue.length;
            },
            get: function(){
                return msgQueue.shift();
            },
            log: log,
            error: function (status) {
                var msg = "";
                switch(status){
                    case 404:msg = "页面未找到";break;
                    case 500:msg = "网站出错";break;
                    default:msg = "出错了";break;
                }
                return this.log(msg);
            }
        }
    }]);

//List接口
blogServices.factory('blogList', ['$resource','blogMessage',
    function ($resource,blogMessage) {
        var res_list = $resource(SERVICE_PATH.LIST);        
        return {
            default: function(page=1,callback){//默认调用（主页）
                return res_list.get({
                    page:page
                },callback,function(httpResponse){
                    blogMessage.error(httpResponse);
                });
            },
            tag: function(tag="",page=1,callback){//获取标签列表
                return res_list.get({
                    tag:tag,
                    page:page
                },callback,function(httpResponse){
                    blogMessage.error(httpResponse);
                });
            },
            author: function(author="",page=1,callback){//获取作者列表
                return res_list.get({
                    author:author,
                    page:page
                },callback,function(httpResponse){
                    blogMessage.error(httpResponse);
                });
            },
            search: function(text="",page=1,callback){//搜索功能
                var key,author,tag,arr;
                arr = text.match(/(?:tag:|#)(\w+\b)/i);//匹配标签
                tag = arr&&arr[1]||"";
                arr = text.match(/(?:^|\s+)([\w\u4e00-\u9fa5\u0800-\u4e00]+)(?:\s+|$)/i);//匹配关键词（中日英数）
                key = arr&&arr[1]||"";
                arr = text.match(/(?:author:|@)(\w+\b)/i);//匹配作者
                author = arr&&arr[1]||"";
                return res_list.get({
                    tag:tag,
                    keyword:key,
                    author:author,
                    page:page
                },callback,function(httpResponse){
                    blogMessage.error(httpResponse);
                });
            }
        }
    }]);

//Article接口
blogServices.factory('blogArticle',['$resource',
    function ($resource){
        return $resource(SERVICE_PATH.ARTICLE,{articleId:""},{
            view:{method:"GET"},
            edit:{method:"GET",params:{action:"edit"}},
            save:{method:"POST"},
            delete:{method:"DELETE"} 
        });
    }]);