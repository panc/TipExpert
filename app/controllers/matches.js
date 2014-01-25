
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    utils = require('../utils/utils');

/**
 * Create
 */
exports.create = function(req, res) {
    
    var match = new Match(req.body);

    match.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(match);
    });
};

