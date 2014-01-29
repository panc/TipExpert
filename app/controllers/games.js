
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game'),
    utils = require('../utils/utils');
    
/**
 * Load
 */
exports.load = function(req, res, next, id) {
    
    Game.load(id, function(err, game) {
        if (err)
            return next(err);
        if (!game)
            return next(new Error('not found'));
        req.league = league;
        return next();
    });
};

/**
 * Create game
 */
exports.create = function(req, res) {
    
    var match = new Match(req.body);

    match.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(match);
    });
};

/**
 * Save game
 */
exports.updateMatch = function(req, res) {
    var match = req.match;
    match = _.extend(match, req.body);
    
    match.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(match);
    });
};

/**
 * Show games for given user
 */
exports.showGamesForUser = function(req, res) {
   
    Game.getGamesForPlayer(res.user.id, function(err, games) {
        if (err)
            return res.render('500');

        res.render('games/forUser', {
            leagues: leagues,
            selectedLeague: (!leagueId && leagues) ? leagues[0].id : leagueId
        });
    });
};
