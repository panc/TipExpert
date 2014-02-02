// module dependencies
var auth = require('./middlewares/authorization');

// controller
var articles = require('../app/controllers/articles'),
    users = require('../app/controllers/users'),
    matches = require('../app/controllers/matches'),
    games = require('../app/controllers/games');

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];

var redirectToAngular = function(req, res) {
    res.sendfile('./app/views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
};

module.exports = function(app, shrinkr, passport) {

    // Parameter based preloaders
    app.param('leagueId', matches.loadLeague);
    app.param('articleId', articles.load);

    
    shrinkr.route({
        // Session routes
        "login": {
            path: "/login",
            get: users.login
        },
        "logout": {
            path: "/logout",
            get: users.logout
        },
        "signup": {
            path: "/signup",
            get: users.signup
        },
        
        // Authentication routes
        "auth": {
            path: "/auth",
            post: [
                passport.authenticate('local', {
                    failureRedirect: '/login'
                }),
                users.session
            ]
        },
        "auth.facebook": {
            path: "/facebook",
            get: [
                passport.authenticate('facebook', {
                    scope: ['email', 'user_about_me'],
                    failureRedirect: '/login'
                }),
                users.signin
            ]
        },
        "auth.facebook.callback": {
            path: "/callback",
            get: [
                passport.authenticate('facebook', {
                    failureRedirect: '/login'
                }),
                users.authCallback
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
                users.signin
            ]
        },
        "auth.google.callback": {
            path: "/callback",
            get: [
                passport.authenticate('google', {
                    failureRedirect: '/login'
                }),
                users.authCallback
            ]
        },
        
        // Article routes
        "article": {
            path: "/articles",
            get: articles.index,
            post: [articleAuth, articles.create]
        },
        "article.new": {
            path: "/new",
            get: [articleAuth, articles.new]
        },
        "article.item": {
            path: "/:articleId",
            get: articles.show,
            put: [articleAuth, articles.update]
        },
        "article.item.edit": {
            path: "/edit",
            get: [articleAuth, articles.edit]
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

        // Home route
        "home": {
            path: "/",
            get: redirectToAngular
        },
    });
    
    // let angularjs handle all other routes
    // this can not be done via shrink route, because it fails when handling paramerts (e.g. :userId)
    app.get('*', redirectToAngular);
};