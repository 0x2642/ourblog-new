exports.get=function(name){
	var constant={
					"PAGE_SIZE":2,
					"LOGIN_CERTIFICATE_LENGTH":2,
					"APPLY_CERTIFICATE_TIMEOUT":60*15*1000
				}
	return constant[name];
}