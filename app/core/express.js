var express = require('express');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var pkg = require('../../package.json');
var swig = require('swig');
var compression = require('compression');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var assetConfig = require('../config/assets-config');
var csrf = require('csurf');
var session = require('express-session');

module.exports = function(app, config, passport) {

    var env = process.env.NODE_ENV || 'development';
    var assets = assetConfig(config);

    swig.setFilter('minifyURL', function(url){
        return assets.minifiedURL(url);
    });

    app.set('showStackError', true);

    // should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
    
    // don't log during tests
    if (env !== 'test')
        app.use(logger(env !== 'development' ? 'combined' : 'dev'));

    app.engine('html', swig.renderFile);

    app.set('view engine', 'html');
    app.set('views', config.root + '/app/api/views');

    // expose package.json to all views
    app.use(function(req, res, next) {
        res.locals.pkg = pkg;
        next();
    });

    app.use(cookieParser()); // cookieParser should be above session
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    // express/mongo session storage
    app.use(session({
        secret: 'tipexpert', // todo
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(assets.middleware);

    app.use('/', express.static(config.root + '/public'));
    app.use('/bower', express.static(config.root + '/bower_components'));

    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
        app.use(csrf());
        
        // pass the csrfToken to every response
        app.use(function(req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
        });
    } else {
        console.log("Test mode - csrf support not activated!");
    }

    // routes should be at the last
    require('./routes')(app, passport);

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
        res.status(500).json('500', err.stack);
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
        res.status(404).json('404');
    });
};
