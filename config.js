var config = {

	// 远程db地址
	dbUrl: "mongodb://public:111111@ds034279.mlab.com:34279/ourblog",

	// 是否只允许
	allow_sign_up: true, 

	cookieSecrete: 'ourblog',

	// 默认为开发模式
	debug: true,

	// session 配置
	session_secret: 'ourblog'
}

module.exports = config;