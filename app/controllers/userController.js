
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../utils/utils'),
    roles = require('../../public/modules/user/userConfig').roles;


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
 * Logout
 */
exports.logout = function(req, res) {
    req.logout();
    res.send(200);
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.role = roles.user; 

    user.save(function(err) {
        if (err) 
            return res.json(400, { errors: utils.formatErrors(err.errors) });
        
        // manually login the user once successfully signed up
        req.logIn(user, function(e) {
            if (e)
                return next(e);

            return res.send(200);
        });
    });
};

/**
 * List all user
 */
exports.list = function(req, res) {
    User.list(function(err, users) {
        res.json(users);
    });
};