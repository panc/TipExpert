
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../../helper/formatHelper'),
    roles = require('../../../public/modules/user/userConfig').roles,
    _ = require('underscore');


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

exports.load = function(req, res, next, id) {
    
    User.load(id, function(err, user) {
        if (err)
            return next(err);
        if (!user)
            return next(new Error('not found'));
        req.loadedUser = user;
        return next();
    });
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
            return res.json(500, { errors: utils.formatErrors(err.errors) });
        
        // manually login the user once successfully signed up
        req.logIn(user, function(e) {
            if (e)
                return res.json(500, e);

            return res.json(200, user);
        });
    });
};

exports.update = function(req, res) {
    var user = req.loadedUser;
    user = _.extend(user, req.body);

    user.save(function(err) {
        if (err) 
            return res.json(500, { errors: utils.formatErrors(err.errors) });

        return res.send(200);
    });
};

/**
 * List all user
 */
exports.list = function(req, res) {
    User.list(function(err, users) {
        if (err) 
            return res.json(500, { errors: utils.formatErrors(err.errors) });
       
        res.json(users);
    });
};