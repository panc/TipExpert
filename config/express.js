
// module dependencies
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    pkg = require('../package.json'),
    swig = require('swig'),
    profile = require('./middlewares/profile'),
    logger = require('winston'),
    shrinkroute = require('shrinkroute'),
    I18n = require('i18n-2'),
    minify = require('connect-minify'),
    path = require('path');

module.exports = function(app, config, passport) {

    var env = process.env.NODE_ENV || 'development';
    
    // Load Module and Instantiate
    I18n.expressBind(app, {
        // setup some locales - other locales default to en silently
        locales: ['en', 'de'],
        directory: '../locales'
    });

    var assets = minify({
        // assets map - maps served file identifier to a list of resources
        assets: {
            '/css/main.min.css': [
                '/public/css/site.css',
                '/public/css/bootstrap.css'
            ],
            '/js/bower.min.js': [
                '/bower_components/angular/angular.js',
                '/bower_components/angular-bootstrap/ui-bootstrap.js',
                '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                '/bower_components/angular-route/angular-route.js',
                '/bower_components/angular-cookies/angular-cookies.js',
                '/bower_components/angular-ui-router/release/angular-ui-router.js'
            ],
            '/js/app.min.js': [
                '/public/modules/user/userConfig.js',
                '/public/app.js',
                '/public/modules/user/userServices.js',
                '/public/modules/user/userPresenter.js',
                '/public/modules/home/homePresenter.js',
                '/public/modules/game/gameControllers.js',
                '/public/modules/match/matchControllers.js'
            ]
        },
        // root - where resources can be found
        root: path.join(__dirname, '..'),
        development: env === 'development',
        map: {
            '/bower_components/': '/bower/',
            '/public/': '/'
        }
    });

    swig.setFilter('minifyURL', function(url){
        return assets.minifiedURL(url);
    });

    var shrinkr = shrinkroute();
    shrinkr.app(app);

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

    app.engine('html', swig.renderFile);

    app.set('view engine', 'html');
    app.set('views', config.root + '/app/views');

    // expose package.json to all views
    app.use(function(req, res, next) {
        res.locals.pkg = pkg;
        next();
    });

    // cookieParser should be above session
    app.use(express.cookieParser());

    // json parser should be above methodOverride
    app.use(express.urlencoded());
    app.use(express.json());
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

    app.use(shrinkr.middleware);
    app.use(assets.middleware);

    app.use(profile.exposeUserInfoToViews);
    app.use('/', express.static(config.root + '/public'));
    app.use('/bower', express.static(config.root + '/bower_components'));

    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
        app.use(express.csrf());
        
        app.use(function(req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
        });
    } else {
        console.log("Test mode - csrf support not activated!");
    }

    // routes should be at the last
    app.use(app.router);
    require('./routes')(app, shrinkr, passport);

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        // log it
        logger.error(err.stack);

        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))) {

            return next();
        }

        // error page
        res.status(500).json('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
        res.status(404).json('404');
    });
};
