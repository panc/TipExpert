
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    utils = require('../utils/utils');


/**
 * Create
 */
exports.create = function(req, res) {
    
    var league = new League(req.body);

    league.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(league);
    });
};

