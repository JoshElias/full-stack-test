const User = require('../models/User');
const validator = require('validator');

const validateCreateUserFields = function(errors, req) {
	if (/^\s*$/.test(req.body.name)) {
		errors["name"] = "Please enter a valid name";
	}
	if (!validator.isEmail(req.body.email)) {
		errors["email"] = "Please use a valid email";
	}
	if (!validator.isAscii(req.body.password)) {
		errors["password"] = "Invalid characters in password, please try another one";		
	}
	if (!validator.isLength(req.body.password, {min: 8, max: 25})) {
		errors["password"] = "Your password should have at least 8 but no more than 25 characters";
	}
}

exports.validateUser = function(errors, req) {
	return new Promise( (resolve, reject) => {
		validateCreateUserFields(errors, req);
		//return a promise
		return User.findOne({
			"email": req.body.email
		}).then(user => {
			if (user !== null) {
				errors["email"] = "Email is already in use";
			}
			resolve(errors);
		})
	})
}