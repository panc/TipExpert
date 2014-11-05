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

    var authentication = express.Router();
    
    // /auth/
    authentication.route('/')
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
    authentication.route('/facebook')
        .get(passport.authenticate('facebook',
                {
                    scope: ['email', 'user_about_me'], 
                    failureRedirect: '/'
                }), 
             user.signin
         );
    
    // /auth/facebook/callback
    authentication.route('/facebook/callback')
        .get(passport.authenticate('facebook', 
                {
                    scope: ['email', 'user_about_me'],
                    failureRedirect: '/'
                }),
             user.authCallback
         );
    
    // /auth/google
    authentication.route('/google')
        .get(passport.authenticate('google',
                {
                    failureRedirect: '/',
                    scope: [
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/userinfo.email'
                    ]
                }),
             user.signin
         );
    
    // /auth/google/callback
    authentication.route('/google/callback')
        .get(passport.authenticate('google', 
                {
                    failureRedirect: '/'
                }),
             user.authCallback
         );

    app.use('/auth', authentication);
    
    
    // API routes (for angular.js or any mobile app)
    var api = express.Router();
    
    api.route('/')
       .get(redirectToAngular);
       
    // /api/user
    api.route('/user')
       .get(auth.requiresLogin, user.list);
       
    // /api/user/{id}
    api.route('/user/:userId')
       .get(user.loadProfile)
       .put(auth.requiresLogin, user.update);
       
       
    // League routes
    
    // /api/leagues
    api.route('/leagues')
       .get(auth.requiresLogin, leagues.list)
       .post(auth.requiresLogin, leagues.create);
       
    // /api/leagues/{id}
    api.route('/leagues/:leagueId')
       .put(auth.requiresLogin, leagues.update)
       .delete(auth.requiresLogin, leagues.delete);
       
    // /api/leagues/{id}/matches
    api.route('/leagues/:leagueId/matches')
       .get(auth.requiresLogin, matches.getMatchesForLeague);
    
    
    // Match routes
    
    // /api/matches
    api.route('/matches')
       .get(auth.requiresLogin, matches.list)
       .post(auth.requiresLogin, matches.create);
       
    // /api/matches/{id}
    api.route('/matches/:matchId')
       .put(auth.requiresLogin, matches.update);
    
    
    // Game routes
    
    
    
    //shrinkr.route({
        
        /*
        // API routes (for angular.js or any mobile app)
                
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