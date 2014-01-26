
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
    res.render('users/login');
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        action: req.buildUrl('user'),
        user: new User()
    });
};

/**
 * Logout
 */
exports.logout = function(req, res) {
    req.logout();
    res.redirect(req.buildUrl('login'));
};

/**
 * Session
 */
exports.session = redirectAfterLogin;

exports.index = function(req, res) {
    res.render('users/index');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors:  utils.formatErrors(err.errors),
                action: req.buildUrl('user'),
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

/**
 *  Show profile
 */
exports.showProfile = function(req, res) {
    var user = req.profile;
    res.render('users/profile', {
        user: user
    });
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User.findOne({ _id: id })
        .exec(function(err, user) {
            if (err)
                return next(err);

            if (!user)
                return next(new Error(req.i18n.__('Failed to load User %s', id)));

            req.profile = user;
            return next();
        });
};
