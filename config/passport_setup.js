const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
            done(err, user);
		});	
	});
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email', 
				passwordField: 'password',
				passReqToCallback: true
			},
			function(req, email, password, done) {
				return User.findOne({
					"email": email
				}).then(user => {
					if (user == null) {
						req.flash('loginErrorMessage', 'User not found');
						return done(null, false);
					} else if (user.password == null) {
						req.flash('loginErrorMessage', 'You must enter your password');
						return done(null, false);
					} else if(!user.validPassword(password)) {
						req.flash('loginErrorMessage', 'Incorrect credentials');
						return done(null, false);
					}
					return done(null, user);
				}).catch(err => {
					done(err, false);
				})
			}
		)
	)
}