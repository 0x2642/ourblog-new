var express = require('express');
var router = express.Router();
var dao = require('../dao/indexDAO.js');
var util = require('../util');


/* GET API */
router.get('/', function(req, res, next) {
  res.send('hello world!');
});
router.get('/list', function(req, res, next) {
	var page=req.param('page') || 1;
	var tag=req.param('tag');
	var keyword=req.param('keyword');
	var author=req.param('author');
	var auth=util.Cookies.getCookie(req,'auth');

	var list=[{
				"articles": [{
			            "id": 1001,
			            "title": "文章标题1",
			            "description": "文章描述1",
			            "author": {
			                "id": "xykbear",
			                "name": "XYKbear"
			            },
			            "timestamp": 1459346686265,
			            "thumb": "images/thumb.jpg",
			            "tags": [
			                "JavaScript",
			                "code"
			            ],
			            "actions": [
			                "edit",
			                "delete"
			            ]
			        },
			        {
			            "id": 1002,
			            "title": "文章标题2",
			            "description": "文章描述2",
			            "author": {
			                "id": "xykbear",
			                "name": "XYKbear"
			            },
			            "timestamp": 1459346686265,
			            "thumb": "images/thumb.jpg",
			            "tags": [
			                 "ACG",
			                 "菟饼"
			            ],
			            "actions": []
			        }
			    ],
			    "pagenation": {
			        "current": 1,
			        "max": 2
			    }
			},
			{
				"articles": [{
		            "id": 1003,
		            "title": "文章标题3",
		            "description": "文章描述3",
		            "author": {
		                "id": "xykbear",
		                "name": "XYKbear"
		            },
		            "timestamp": 1459346686265,
		            "thumb": "images/thumb.jpg",
		            "tags": [
		                "code",
		                "PHP"
		            ],
		            "actions": [
		                "edit"
		            ]
		        },
		        {
		            "id": 1004,
		            "title": "文章标题4",
		            "description": "文章描述4",
		            "author": {
		                "id": "xykbear",
		                "name": "XYKbear"
		            },
		            "timestamp": 1459346686265,
		            "thumb": "images/thumb.jpg",
		            "tags": [
		                "ACG",
		                "Steam"
		            ],
		            "actions": []
		        }],
			    "pagenation": {
			        "current": 1,
			        "max": 2
			    }
			}]

	page=Math.abs(page-1)
	res.send(list[page]||{});
});
module.exports = router;
