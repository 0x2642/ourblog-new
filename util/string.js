
function filterString(val){
	return val.replace(/<[^>]+>/g,"").replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
}

function filterInteger(val){
	val=parseInt(val);
	return isNaN(val)?0:val
}

function filterFloat(val){
	val=parseFloat(val);
	return isNaN(val)?0.0:val
}

function filterPass(val){
	return val
}

exports.filter = function(val,type) {
	var func="filter"+type;
	return eval(func)(val)
}

exports.sendError2JSON = function(msg,code) {
	return {error_code:code,msg:msg}
}