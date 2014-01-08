// module dependencies
var express = require('express'),
    fs = require('fs');

// load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

// bootstrap db connection
mongoose.connect(config.db);

// bootstrap models
var models_path = config.root + '/app/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// bootstrap express
var app = express();
require('./config/express')(app, config);

// bootstrap routes
require('./config/routes')(app);

// start the app by listening on <port>
var port = process.env.PORT || 1337;
app.listen(port);

console.log('Application started on port ' + port);

// samples 
// http://blog.ijasoneverett.com/2013/03/a-sample-app-with-node-js-express-and-mongodb-part-1/
// http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
// http://howtonode.org/express-mongodb

// http://caolanmcmahon.com/posts/nodejs_style_and_structure/
