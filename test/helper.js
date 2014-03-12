
var mongoose = require('mongoose'),
    async = require('async'),
    League = mongoose.model('League'),
    User = mongoose.model('User');

exports.clearDb = function(done) {
    async.parallel([
        function(cb) {
            User.collection.remove(cb);
        },
        function(cb) {
            League.collection.remove(cb);
        }
    ], done);
};