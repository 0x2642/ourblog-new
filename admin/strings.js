exports.getPageTitle = function(titleStr) {
	return StringList[titleStr];
}

var StringList = {
	"STR_ADMIN_01_01_01" : "加班超级管理员系统",
	"STR_ADMIN_01_02_01" : "控制面板",
	"STR_ADMIN_01_03_01" : "子加班员列表",
	"STR_ADMIN_01_04_01" : "子加班员控制",
	"STR_ADMIN_01_04_02" : "增加子加班员",
	"STR_ADMIN_01_04_03" : "删除子加班员",
	"STR_ADMIN_01_04_04" : "修改子加班员权限",
	"STR_ADMIN_ERR_01" : "通过Email获取用户信息失败",
	"STR_ADMIN_ERR_02" : "用户已存在",
	"STR_ADMIN_ERR_03" : "保存新用户失败",
	"STR_ADMIN_ERR_04" : "删除所有用户失败"
}