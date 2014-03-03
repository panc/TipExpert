// module dependencies
var auth = require('./middlewares/authorization');

// controller
var articles = require('../app/controllers/articles'),
    user = require('../app/controllers/userController'),
    matches = require('../app/controllers/matches'),
    games = require('../app/controllers/games'),
    roles = require('../public/modules/user/userConfig').roles;


var redirectToAngular = function(req, res) {
    var user = req.user || { };
    
    var picture = '';
    if (user.google)
        picture = req.user.google.picture;
    if (user.facebook)
        picture = req.user.facebook.picture.data.url ;
    
    res.cookie('user', JSON.stringify({
        'id': user.id || '',
        'name': user.name || '',
        'role': user.role || roles.public,
        'picture': picture
    }));
    
    res.render('template');
};

module.exports = function(app, shrinkr, passport) {

    // Parameter based preloaders
    app.param('leagueId', matches.loadLeague);
    app.param('articleId', articles.load);
    app.param('userId', user.load);
    
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
                        
                        res.json(200, user);
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
        
        // Article routes
        "article": {
            path: "/articles",
            get: articles.index,
            post: [auth.requiresLogin, articles.create]
        },
        "article.new": {
            path: "/new",
            get: [auth.requiresLogin, articles.new]
        },
        "article.item": {
            path: "/:articleId",
            get: articles.show,
            put: [auth.requiresLogin, articles.update]
        },
        "article.item.edit": {
            path: "/edit",
            get: [auth.requiresLogin, articles.edit]
            //del: [articleAuth, articles.delete]
        },
        
        // Match and League routes
        "leagues": {
            path: "/leagues",
            get: matches.index,
            post: matches.createLeague
        },
        "leagues.matches": {
            path: "/:leagueId/matches",
            get: matches.getMatchesForLeague
        },
        "matches": { 
            path: "/matches",
            get: matches.index, // just an alias
            post: matches.createMatch,
            put: matches.updateMatch
        },
        
        // Game routes
        "games": { 
            path: "/games",
            get: games.index,
            post: games.create,
            put: games.update
        },
        "games.createdByMe": { 
            path: "/createdbyme",
            get: games.index,
        },
        "games.search": { 
            path: "/search",
            get: games.index,
        },
        "games.new": { 
            path: "/new",
            get: games.new,
        },
        "games.edit": { 
            path: "/edit",
            get: games.edit,
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
        }
    });
    
    // let angularjs handle all other routes
    // this can not be done via shrink route, because it fails when handling paramerts (e.g. :userId)
    app.get('*', redirectToAngular);
};