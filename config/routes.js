
// controlers
var articles = require('../app/controllers/articles'),
    users = require('../app/controllers/users');

// Route middlewares
//var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

// expose routes
module.exports = function(app, passport) {

    // user routes
    app.get('/login', users.login);
    //app.get('/signup', users.signup) // do we need signup?
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.get('/users/:userId', users.showProfile);
    
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin);
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }), users.authCallback);

    app.get('/auth/google',
        passport.authenticate('google', {
            failureRedirect: '/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }), users.authCallback);

    app.param('userId', users.user);

    // article routes
    app.get('articles', '/articles', articles.index);
    app.get('/articles/new', articles.new);
    app.post('/articles', articles.create);
    app.get('articles-item', '/articles/:id', articles.show);
    app.get('articles-item-edit', '/articles/:id/edit', articles.edit);
    app.put('/articles/:id', articles.update);
    //app.del('/articles/:id', articleAuth, articles.destroy)

    app.param('id', articles.load);

    // home route
    app.get('/', articles.index);
};
