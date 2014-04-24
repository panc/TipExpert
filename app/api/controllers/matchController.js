
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Match = mongoose.model('Match'),
    gameUpdater = require('../../core/gameUpdater');
    utils = require('../../helper/formatHelper'),
    _ = require('underscore');
    
/**
 * Load
 */
exports.load = function(req, res, next, id) {
    
    Match.load(id, function(err, match) {
        if (err)
            return next(err);
        if (!match)
            return next(new Error('not found'));
        
        req.match = match;
        return next();
    });
};

/**
 * Create match
 */
exports.create = function(req, res) {
    
    var match = new Match(req.body);

    match.save(function(error) {
        if (error)
            return res.json('500', utils.formatErrors(error.errors));
        
        return res.json(match);
    });
};

/**
 * Save match after edit
 */
exports.update = function(req, res) {
    var match = req.match;
    match = _.extend(match, req.body);

    match.save(function(error) {
        if (error)
            return res.json('500', utils.formatErrors(error.errors));

        gameUpdater.updateTipsForMatch(match);

        return res.json(match);
    });
};

/**
 * Get matches for league
 */
exports.getMatchesForLeague = function(req, res) {

    Match.list({ leagueId: req.league.id }, function(err, matches) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));

        return res.json(matches);
    });
};

/**
 * List all matches
 */
exports.list = function(req, res) {

    Match.list({ }, function(err, matches) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));

        return res.json(matches);
    });
};
