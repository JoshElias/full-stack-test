
const User = require("../models/User");
const passport = require('passport');
const {validateUser} = require('../validators/signup');
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.JWT_SECRET;

exports.show_login = function(req, res, next) {
	return res.render('user/login', { formData: {}, errors: req.flash('loginErrorMessage') });
}

exports.show_signup = function(req, res, next) {
	return res.render('user/signup', { formData: {}, errors: {} });
}

const rerender_signup = function(errors, req, res, next) {
	return res.render('user/signup', { formData: req.body, errors: errors});
}

exports.signup = async function(req, res, next) {
    let errors = {};
    const {name, email, password} = req.body;
    errors = await validateUser(errors, req);   
    if (errors.constructor === Object && Object.keys(errors).length !== 0) {
        return rerender_signup(errors, req, res, next);
    } 
    const newUser = new User({
        "name": name,
        "email": email,
        "password": User.generateHash(password)
    });

    await newUser.save();    
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/signup",
        failureFlash: true
    })(req, res, next);	
}

exports.login = function(req, res, next) { 
	passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.redirect('/login'); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            var payload = {
                id: user._id,
                email: user.email, 
            };

            //generate jwt and send back in cookie (or in headers)
            var token = jwt.sign(payload, tokenSecret, { 
              expiresIn: '1d',
            });
            res.cookie('json-web-token', token);
            return res.redirect('/');
        });
      })(req, res, next);
}

exports.logout = function(req, res, next) { 
	req.logout();
	req.session.destroy();
	res.redirect('/');
}