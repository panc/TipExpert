// module dependencies.
var express = require('express'),
    swig = require('swig'),
    fs = require('fs');

var mongoose = require('mongoose');

var app = express();
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// disable swig's view cache and use caching of express instead 
// (which is enabled by default)
swig.setDefaults({ cache: false });

// serve static files
app.use(express.static(__dirname + '/public'));

// Bootstrap db connection
mongoose.connect('mongodb://localhost/TipExpert');

console.log("Connected to mongodb");

// Bootstrap models
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

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