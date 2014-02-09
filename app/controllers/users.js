
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../utils/utils');


var redirectAfterLogin = function(req, res) {
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};

exports.signin = function(req, res) { };

/**
 * Auth callback
 */
exports.authCallback = redirectAfterLogin;

/**
 * Show login form
 */
exports.login = function(req, res) {
    res.render('user/login');
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('user/signup', {
        user: new User()
    });
};

/**
 * Logout
 */
exports.logout = function(req, res) {
    req.logout();
    res.send(200);
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.send(200);
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('authentication/signup', {
                errors:  utils.formatErrors(err.errors),
                action: req.buildUrl('home'),
                user: user,
            });
        }

        // manually login the user once successfully signed up
        req.logIn(user, function(e) {
            if (e)
                return next(e);

            return res.redirect('/');
        });
    });
};

exports.list = function(req, res) {
    User.list(function(err, users) {
        res.json(users);
    });
};