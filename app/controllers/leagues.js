
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    utils = require('../utils/utils');


/**
 * Create
 */
exports.create = function(req, res) {
    
    var league = new League(req.body);

    league.save(function(error) {
        res.contentType('json');
        res.send({ some: JSON.stringify({ response: 'json' }) });
    });
};

