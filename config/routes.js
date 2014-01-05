
//var async = require('async');

// controlers
var articles = require('../app/controllers/articles');

// Route middlewares
//var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

// expose routes
module.exports = function(app) {

    // article routes
    app.get('/articles', articles.index);
    //app.get('/articles/new', auth.requiresLogin, articles.new);
    //app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    //app.get('/articles/:id/edit', articleAuth, articles.edit)
    //app.put('/articles/:id', articleAuth, articles.update)
    //app.del('/articles/:id', articleAuth, articles.destroy)

    app.param('id', articles.load);

    // home route
    app.get('/', articles.index);
};
