
// controlers
var articles = require('../app/controllers/articles'),
    users = require('../app/controllers/users'),
    auth = require('./middlewares/authorization'),
    shrinkroute = require('shrinkroute');

// Route middlewares
var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];


// expose routes
module.exports = function(app, passport) {

    var shrinkr = shrinkroute( app, {
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
        // User routes
        "user": {
            path: "/users",
            post: users.create
        },
        "user.profile": {
            path: "/:userId",
            get: users.showProfile
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
            get :[
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
        // Home route
        "home": {
            path: "/",
            get: articles.index
        }
    });

    // Parameter based preloaders
    app.param('userId', users.user);
    app.param('articleId', articles.load);

    app.use(shrinkr.middleware);

};
