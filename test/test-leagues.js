
var mongoose = require('mongoose'),
    should = require('should'),
    request = require('supertest'),
    app = require('../app'),
    context = describe,
    League = mongoose.model('League');

var count;

// league tests
 
describe('Leagues', function() {
//    describe('POST /leagues', function() {
//        describe('Invalid parameters', function() {
//            before(function(done) {
//                League.count(function(err, cnt) {
//                    count = cnt;
//                    done();
//                });
//            });
//
//            it('no name - should respond with errors', function(done) {
//                request(app)
//                    .post('/leagues')
//                    .field('name', '')
//                    .expect('Content-Type', /json/)
//                    .expect(500)
//                    .expect(/League name cannot be blank/)
//                    .end(done);
//            });
//
//            it('should not save the league to the database', function(done) {
//                League.count(function(err, cnt) {
//                    count.should.equal(cnt);
//                    done();
//                });
//            });
//        });
//
//        describe('Valid parameters', function() {
//            before(function(done) {
//                League.count(function(err, cnt) {
//                    count = cnt;
//                    done();
//                });
//            });
//
//            it('should return the new league object', function(done) {
//                request(app)
//                    .post('/leagues')
//                    .field('name', 'Bundesliga')
//                    .expect('Content-Type', /json/)
//                    .expect(function(res) {
//                        if (res.body.name != 'Bundesliga')
//                            return 'League name do not match';
//                    })
//                    .end(done);
//            });
//
//            it('should insert a record to the database', function(done) {
//                League.count(function(err, cnt) {
//                    cnt.should.equal(count + 1);
//                    done();
//                });
//            });
//
//            it('should save the league to the database', function(done) {
//                League.findOne({ name: 'Bundesliga' }).exec(function(err, league) {
//                    should.not.exist(err);
//                    league.should.be.an.instanceOf(League);
//                    league.name.should.equal('Bundesliga');
//                    done();
//                });
//            });
//        });
//    });

    after(function(done) {
        require('./helper').clearDb(done);
    });
});
