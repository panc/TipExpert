
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Match = mongoose.model('Match'),
    utils = require('../../helper/formatHelper'),
    _ = require('underscore');
    
/**
 * Load
 */
exports.load = function(req, res, next, id) {
    
    League.load(id, function(err, league) {
        if (err)
            return next(err);
        if (!league)
            return next(new Error('not found'));
        
        req.league = league;
        return next();
    });
};

/**
 * List
 */
exports.list = function(req, res) {

    League.list(function(err, leagues) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));
        
        return res.json(leagues);
    });
};

/**
 * Create league
 */
exports.create = function(req, res) {
    
    var league = new League(req.body);

    league.save(function(err) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));
        
        return res.json(league);
    });
};

/**
 * Update leage
 */
exports.update = function(req, res) {
    var league = req.league;
    league = _.extend(league, req.body);
    
    league.save(function(err) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));
        
        return res.json(league);
    });
};

/**
 * remove leage
 */
exports.delete = function(req, res) {
    var league = req.league;
    
    league.remove(function(err) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));
        
        return res.send(200);
    });
};