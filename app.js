// module dependencies.
var express = require('express'),
    swig = require('swig');

var app = express();
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// disable swig's view cache and use caching of express instead 
// (which is enabled by default)
swig.setDefaults({ cache: false });

// serve static files
app.use(express.static(__dirname + '/public'));

// routes
app.get('/', function(req, res) {
    res.render('home', { /* template locals context */ });
});

app.listen(1337);

console.log('Application Started on http://localhost:1337/');

// samples 
// http://blog.ijasoneverett.com/2013/03/a-sample-app-with-node-js-express-and-mongodb-part-1/
// http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
// http://howtonode.org/express-mongodb

// http://caolanmcmahon.com/posts/nodejs_style_and_structure/