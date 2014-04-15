var roles = require('../../../public/modules/user/userConfig').roles;
    
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

exports.requiresGameCreator = function(req, res, next) {
    if (!req.user || !req.game || req.user.id != req.game.creator.id) 
        return res.send(401, 'Not authorized!');
        
    return next();
};

exports.requiresGamePlayer = function(req, res, next) {
    if (!req.user || !req.game) 
        return res.send(401, 'Not authorized!');

    var userExists = false;
    for (var i = 0; i < req.game.players.length; i++) {
        
        if (req.game.players[i].user.id == req.user.id) {
            userExists = true;
            break;
        }
    }

    if (!userExists)
        return res.send(401, 'Not authorized!');

    return next();
};