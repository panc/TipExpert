// module dependencies
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('winston');

// load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./app/config/app-config')[env]
  , mongoose = require('mongoose');

// bootstrap db connection
// connect to mongodb
var connect = function() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
};
connect();

// error handler
mongoose.connection.on('error', function(err) {
    logger.error(err.message);
});

// reconnect when closed
mongoose.connection.on('disconnected', function() {
    connect();
});

// bootstrap models
var models_path = config.root + '/app/api/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// bootstrap passport config
require('./app/config/passport-config')(passport, config);

// bootstrap express
var app = express();

require('./app/core/express')(app, config, passport);

// start the app by listening on <port>
var port = process.env.PORT || 1337;
app.listen(port);

logger.info('Application started on port %d', port);

// expose app (needed for tests)
exports = module.exports = app;
