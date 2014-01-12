
var mongoose = require('mongoose'),
    should = require('should'),
    request = require('supertest'),
    app = require('../app'),
    context = describe,
    User = mongoose.model('User'),
    Article = mongoose.model('Article'),
    agent = request.agent(app);

var count;

// articles tests

describe('Articles', function() {
    before(function(done) {
        // create a user
        var user = new User({
            email: 'foobar@example.com',
            name: 'Foo bar',
            username: 'foobar',
            password: 'foobar'
        });
        
        user.save(done);
    });

    describe('GET /articles', function() {
        it('should respond with Content-Type text/html', function(done) {
            agent
                .get('/articles')
                .expect('Content-Type', /html/)
                .expect(200)
                .expect(/Articles/)
                .end(done);
        });
    });

    describe('GET /articles/new', function() {
        context('When not logged in', function() {
            it('should redirect to /login', function(done) {
                agent
                    .get('/articles/new')
                    .expect('Content-Type', /plain/)
                    .expect(302)
                    .expect('Location', '/login')
                    .expect(/Moved Temporarily/)
                    .end(done);
            });
        });
    });

    after(function(done) {
        require('./helper').clearDb(done);
    });
});
