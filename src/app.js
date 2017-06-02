'use strict';
import Koa from 'koa';
import convert from 'koa-convert';
import error from 'koa-error';
import cors from 'koa-cors';
import config from './config/config';
import router from './router';
import koaBody from 'koa-body';
import serve from 'koa-static';
import session from './modules/middleware/session';
import SessionStore from './modules/middleware/session.store';


const app = new Koa();

//session
app.use(session({
	key: config.sessionKey,
	store: new SessionStore(),
	overwrite: true
}));

app.use(serve(config.fileDir));

//body解析
app.use(convert(koaBody({
	formidable: {
		uploadDir: config.uploadDir
	},
	multipart: true
})));

/*
跨域支持
todo 白名单
*/
app.use(convert(cors({
	origin: function(req) {
		let origin = req.header.origin;
		if (origin && config.allowOrigins.indexOf(origin) != -1) {
			return origin;
		}
		return config.allowOrigins[0];
	},
	credentials: true,
	headers: ["X-Token", "Content-Type"]
})));

//禁止缓存
if (config.env == 'development') {
	app.use(function(ctx, next) {
		ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
		ctx.set('Pragma', 'no-cache'); // HTTP 1.0.
		ctx.set('Expires', '0'); // Proxies.
		return next();
	});
}
//输出错误日志 开发环境使用
if (config.env == 'development') {
	app.use(convert(error()));
} else {
	app.on('error', function(err, ctx) {
		ctx.status = err.status || 500;
		ctx.body = err.message;
	});
}

//路由
router(app);

app.listen(config.port, function() {
	console.info('listen on', config.port);
});