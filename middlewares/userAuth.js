const createError = require('http-errors');
const tokenSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const verifyToken = function (req) {
	const token = req.cookies['json-web-token'];	
    var verified = false;
    if(token){
        //decode token 
        jwt.verify(token, tokenSecret, function(err, decoded) {  
            if (!err && decoded) {
				verified = true;
			}  
        });
	}
    return verified;
};

exports.isLoggedIn = function (req, res, next) { 
    if(verifyToken(req)){
        return next();
    }
    next(createError(404, "Page not exist"));
};