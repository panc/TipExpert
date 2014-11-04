var express = require('express');
var auth = require('../middlewares/authorization');
var user = require('../api/controllers/userController');
var matches = require('../api/controllers/matchController');
var leagues = require('../api/controllers/leagueController');
var games = require('../api/controllers/gameController');
var userTransformer = require('./userTransformer');


var redirectToAngular = function(req, res) {
    res.cookie('user', JSON.stringify(userTransformer.transformForCookie(req.user)));    
    res.render('template');
};

module.exports = function(app, passport) {

    // Parameter based preloaders
    app.param('leagueId', leagues.load);
    app.param('matchId', matches.load);
    app.param('userId', user.load);
    app.param('gameId', games.load);
    
    
    // Session routes
    app.post("/logout", user.logout);
    app.post("/signup", user.create);

    var authenticationRoutes = express.Router();
    
    // /auth/
    authenticationRoutes.route('/')
        .post(function(req, res, next) {
            passport.authenticate('local', function(err, user) {

                if (err)
                    return next(err);
                if (!user)
                    return res.json(400, { msg: 'User or E-Mail is invalid!' });

                req.logIn(user, function(e) {
                    if (e)
                        return next(err);

                    if (req.body.rememberme)
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;

                    res.json(200, userTransformer.transform(user));
                });
            })(req, res, next);
        });
    
    // /auth/facebook
    authenticationRoutes.route('/facebook')
        .get(passport.authenticate('facebook',
                {
                    scope: ['email', 'user_about_me'], 
                    failureRedirect: '/'
                }), 
             user.signin);
    
    // /auth/facebook/callback
    authenticationRoutes.route('/facebook/callback')
        .get(passport.authenticate('facebook', 
                {
                    scope: ['email', 'user_about_me'],
                    failureRedirect: '/'
                }),
             user.authCallback);
    
    // /auth/google
    authenticationRoutes.route('/google')
        .get(passport.authenticate('google',
                {
                    failureRedirect: '/',
                    scope: [
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/userinfo.email'
                    ]
                }),
             user.signin);
    
    // /auth/google/callback
    authenticationRoutes.route('/google/callback')
        .get(passport.authenticate('google', 
                {
                    failureRedirect: '/'
                }),
             user.authCallback);

    app.use('/auth', authenticationRoutes);
    

    //shrinkr.route({
        
        /*
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
            get: [ user.loadProfile ],
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
            path: "/games",
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
        "api.games.finished": {
            path: "/finished",
            get: [auth.requiresLogin, games.listFinished]
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
        },
        "api.games.item.stake": {
            path: "/stake",
            put: [ auth.requiresLogin, auth.requiresGamePlayer, games.updateStake ]
        },
        "api.games.item.tip": {
            path: "/tip",
            put: [ auth.requiresLogin, auth.requiresGamePlayer, games.updateTip ]
        }
    });*/
    
    // let angularjs handle all other routes
    // this can not be done via shrink route, because it fails when handling paramerts (e.g. :userId)
    app.get('*', redirectToAngular);
};