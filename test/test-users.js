
var mongoose = require('mongoose'),
    should = require('should'),
    request = require('supertest'),
    app = require('../app'),
    context = describe,
    User = mongoose.model('User');

var count;
var agent = request.agent(app);

// users tests
 
describe('Users', function() {
    describe('GET /users', function() {
        
        it ('should require login', function(done) {
            agent.get('/api/user')
                .expect(401)
                .end(done);
        });

    });
    
    describe('POST /users', function() {
        describe('Invalid parameters', function() {
            before(function(done) {
                User.count(function(err, cnt) {
                    count = cnt;
                    done();
                });
            });

//            it('no email - should respond with errors', function(done) {
//                request(app)
//                    .post('/users')
//                    .field('name', 'Foo bar')
//                    .field('email', '')
//                    .field('password', 'foobar')
//                    .expect('Content-Type', /html/)
//                    .expect(200)
//                    .expect(/Email cannot be blank/)
//                    .end(done);
//            });
//
//            it('no name - should respond with errors', function(done) {
//                request(app)
//                    .post('/users')
//                    .field('name', '')
//                    .field('email', 'foobar@example.com')
//                    .field('password', 'foobar')
//                    .expect('Content-Type', /html/)
//                    .expect(200)
//                    .expect(/Name cannot be blank/)
//                    .end(done);
//            });

            it('should not save the user to the database', function(done) {
                User.count(function(err, cnt) {
                    count.should.equal(cnt);
                    done();
                });
            });
        });
//
//        describe('Valid parameters', function() {
//            before(function(done) {
//                User.count(function(err, cnt) {
//                    count = cnt;
//                    done();
//                });
//            });
//
//            it('should redirect to /articles', function(done) {
//                request(app)
//                    .post('/users')
//                    .field('name', 'Foo bar')
//                    .field('email', 'foobar@example.com')
//                    .field('password', 'foobar')
//                    .expect('Content-Type', /plain/)
//                    .expect('Location', /\//)
//                    .expect(302)
//                    .expect(/Moved Temporarily/)
//                    .end(done);
//            });
//
//            it('should insert a record to the database', function(done) {
//                User.count(function(err, cnt) {
//                    cnt.should.equal(count + 1);
//                    done();
//                });
//            });
//
//            it('should save the user to the database', function(done) {
//                User.findOne({ name: 'Foo bar' }).exec(function(err, user) {
//                    should.not.exist(err);
//                    user.should.be.an.instanceOf(User);
//                    user.email.should.equal('foobar@example.com');
//                    done();
//                });
//            });
//        });
    });

    after(function(done) {
        require('./helper').clearDb(done);
    });
});
