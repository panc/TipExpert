// Module dependencies.
var express = require('express'),
    swig = require('swig');

var server = express();
server.engine('html', swig.renderFile);

server.set('view engine', 'html');
server.set('views', __dirname + '/views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
server.set('view cache', false);

// Routes
server.get('/', function(req, res) {
    res.render('home', { /* template locals context */ });
});

server.listen(1337);

console.log('Application Started on http://localhost:1337/');

// samples 
// http://blog.ijasoneverett.com/2013/03/a-sample-app-with-node-js-express-and-mongodb-part-1/
// http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
// http://howtonode.org/express-mongodb

// http://caolanmcmahon.com/posts/nodejs_style_and_structure/