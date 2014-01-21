// module dependencies
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    pkg = require('../package.json'),
    cons = require('consolidate'),
    profile = require('./middlewares/profile'),
    logger = require('winston'),
    shrinkroute = require('shrinkroute'),
    I18n = require('i18n-2');

var articles = require('../app/controllers/articles'),
    users = require('../app/controllers/users'),
    auth = require('./middlewares/authorization');

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];

module.exports = function(app, config, passport) {

    // Load Module and Instantiate
    I18n.expressBind(app, {
        // setup some locales - other locales default to en silently
        locales: ['en', 'de'],
        directory: '../locales'
    });
    var shrinkr = shrinkroute();
    shrinkr.app( app );

    app.set('showStackError', true);

    // should be placed before express.static
    app.use(express.compress({
        filter: function(req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.favicon());

    // logging
    var env = process.env.NODE_ENV || 'development';
    var log;

    if (env !== 'development') {
        log = {
            stream: {
                write: function(message, encoding) {
                    logger.info(message);
                }
            }
        };
    } else {
        log = 'dev';
    }

    // don't log during tests
    if (env !== 'test') app.use(express.logger(log));

    app.engine('html', cons.swig);

    app.set('view engine', 'html');
    app.set('views', config.root + '/app/views');

    // expose package.json to all views
    app.use(function(req, res, next) {
        res.locals.pkg = pkg;
        next();
    });

    // cookieParser should be above session
    app.use(express.cookieParser());

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // express/mongo session storage
    app.use(express.session({
        secret: 'tipexpert', // todo
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use( shrinkr.middleware );

    // Parameter based preloaders
    app.param('userId', users.user);
    app.param('articleId', articles.load);

    app.use(profile.exposeUserInfoToViews);
    app.use(express.static(config.root + '/public'));

    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
        app.use(express.csrf());

        app.use(function(req, res, next) {
            res.locals.csrf_token = req.csrfToken();
            next();
        });
    } else {
        console.log("Test mode - csrf support not activated!");
    }

    // routes should be at the last
    app.use(app.router);

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))) {

            return next();
        }

        // log it
        logger.error(err.stack);

        // error page
        res.status(500).render('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

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
};
