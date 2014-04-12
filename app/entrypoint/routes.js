// module dependencies
var auth = require('./middlewares/authorization');

// controller
var user = require('../api/controllers/userController'),
    matches = require('../api/controllers/matchController'),
    leagues = require('../api/controllers/leagueController'),
    games = require('../api/controllers/gameController'),
    roles = require('../../public/modules/user/userConfig').roles;


var redirectToAngular = function(req, res) {
    res.cookie('user', JSON.stringify(convertUser(req.user)));    
    res.render('template');
};

var convertUser = function(user) {
    user = user || { };
    
    var picture = '';
    if (user.google)
        picture = user.google.picture;
    if (user.facebook)
        picture = user.facebook.picture.data.url;
    
    return {
        'id': user.id || user._id || '',
        'name': user.name || '',
        'role': user.role || roles.public,
        'picture': picture
    };
};

module.exports = function(app, shrinkr, passport) {

    // Parameter based preloaders
    app.param('leagueId', leagues.load);
    app.param('matchId', matches.load);
    app.param('userId', user.load);
    app.param('gameId', games.load);
    
    shrinkr.route({
        // Session routes
        "logout": {
            path: "/logout",
            post: user.logout
        },
        "signup": {
            path: "/signup",
            post: user.create
        },
        
        // Authentication routes
        "auth": {
            path: "/auth",
            post: function(req, res, next) {
                passport.authenticate('local', function(err, user) {

                    if (err)
                        return next(err);
                    if (!user)
                        return res.json(400, {msg: 'User or E-Mail is invalid!'});

                    req.logIn(user, function(e) {
                        if (e)
                            return next(err);

                        if (req.body.rememberme) 
                            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                        
                        res.json(200, convertUser(user));
                    });
                })(req, res, next);
            }
        },
        "auth.facebook": {
            path: "/facebook",
            get: [
                passport.authenticate('facebook', {
                    scope: ['email', 'user_about_me'],
                    failureRedirect: '/login'
                }),
                user.signin
            ]
        },
        "auth.facebook.callback": {
            path: "/callback",
            get: [
                passport.authenticate('facebook', {
                    failureRedirect: '/login'
                }),
                user.authCallback
            ]
        },
        "auth.google": {
            path: "/google",
            get: [
                passport.authenticate('google', {
                    failureRedirect: '/login',
                    scope: [
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/userinfo.email'
                    ]
                }),
                user.signin
            ]
        },
        "auth.google.callback": {
            path: "/callback",
            get: [
                passport.authenticate('google', {
                    failureRedirect: '/login'
                }),
                user.authCallback
            ]
        },
        
        // API routes (for angular.js or any mobile app)
        "api": {
            path: "/api",
            get: redirectToAngular
        },
        "api.user": {
            path: "/user",
            get: [ auth.requiresLogin, user.list ]
        },
        "api.user.item": {
            path: "/:userId",
            put: [ auth.requiresLogin, user.update ]
        },
        
        // Match and League routes
        "api.leagues": {
            path: "/leagues",
            get: [ auth.requiresLogin, leagues.list ],
            post: [ auth.requiresLogin, leagues.create ]
        },
        "api.leagues.item": {
            path: "/:leagueId",
            put: [ auth.requiresLogin, leagues.update ],
            delete: [ auth.requiresLogin, leagues.delete ]
        },
        "api.leagues.matches": {
            path: "/:leagueId/matches",
            get: [ auth.requiresLogin, matches.getMatchesForLeague ]
        },
        "api.matches": { 
            path: "/matches",
            get: [ auth.requiresLogin, matches.list ],
            post: [ auth.requiresLogin, matches.create ]
        },
        "api.matches.item": { 
            path: "/:matchId",
            put: [ auth.requiresLogin, matches.update ]
        },
        
        // Game routes
        "api.games": {
            path: "/:userId/games",
            get: [ auth.requiresLogin, games.list ],
            post: [ auth.requiresLogin, games.create ]
        },
        "api.games.created": {
            path: "/created",
            get: [ auth.requiresLogin, games.listCreated ]
        },
        "api.games.invited": {
            path: "/invited",
            get: [ auth.requiresLogin, games.listInvited ]
        },
        "api.games.item": {
            path: "/:gameId",
            get: [ auth.requiresLogin, games.loadGameForPlayer ]
        },
        "api.games.item.edit": {
            path: "/edit",
            get: [ auth.requiresLogin, auth.requiresGameCreator, games.loadGameForEdit ],
            put: [ auth.requiresLogin, auth.requiresGameCreator, games.update ],
            delete: [ auth.requiresLogin, auth.requiresGameCreator, games.delete ]
        }
    });
    
    // let angularjs handle all other routes
    // this can not be done via shrink route, because it fails when handling paramerts (e.g. :userId)
    app.get('*', redirectToAngular);
};