module.exports = {
	validateRegister : function(req) {
		if (req.body.username.length == 0 || req.body.username.length >= 320) {
			return 'Email not valid';
		}
		if (this.validateEmail(req)) {
			return 'Wrong Email';
		}
		if (req.body.password != req.body.confirmPassword) {
			return 'Passwords do not match';
		}
		return 'REGISTER VALIDATED';
	},
	validateLogin : function(req) {
		if (req.body.username.length == 0 || req.body.username.length >= 320) {
			return 'Email not valid';
		}
		if (this.validateEmail(req)) {
			console.log('RIGHT EMAIL');
			return 'Wrong Email';
		}
		return 'LOGIN VALIDATED';
	},
	validateEmail : function(req) {
		console.log("validateEmail called");
		var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if (!reg.test(req.body.username)) {
			return (true);
		}
		return (false);
	}
};
