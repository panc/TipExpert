// module dependencies.
var express = require('express'),
    swig = require('swig'),
    fs = require('fs');

// load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

// bootstrap db connection
mongoose.connect('mongodb://localhost/TipExpert');

// bootstrap models
var models_path = config.root + '/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

var app = express();
// express settings
require('./config/express')(app, config);


User = mongoose.model('User');

// routes
app.get('/', function(req, res) {
    res.render('home', { /* template locals context */ });
});

app.get('/user', function(req, res) {

    var id = 1; // dummy
    User
        .findOne({ _id: id })
        .exec(function(err, user) {
            if (err) 
                return next(err);
            if (!user) 
                return next(new Error('Failed to load User ' + id));
            req.profile = user;
            return next();
        });
    
    res.render('user', { /* template locals context */ });
});

app.listen(1337);

console.log('Application Started on http://localhost:1337/');

// samples 
// http://blog.ijasoneverett.com/2013/03/a-sample-app-with-node-js-express-and-mongodb-part-1/
// http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
// http://howtonode.org/express-mongodb

// http://caolanmcmahon.com/posts/nodejs_style_and_structure/

// https://github.com/madhums/node-express-mongoose-demo

// http://blog.modulus.io/nodejs-and-express-sessions