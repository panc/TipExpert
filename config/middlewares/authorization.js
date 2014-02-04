var roles = require('../../app/utils/userRoles').roles;
    
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.role == roles.admin || req.user.role == roles.user)) 
        return next();
    
    if (req.method == 'GET')
        req.session.returnTo = req.originalUrl;

    res.send(401);
};

exports.requiresAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role == roles.admin) 
        return next();
    
    if (req.method == 'GET')
        req.session.returnTo = req.originalUrl;

    res.send(401);
};