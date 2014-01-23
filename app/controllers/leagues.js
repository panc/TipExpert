
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Match = mongoose.model('Match'),
    utils = require('../utils/utils');

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
exports.index = function(req, res) {
    
    League.list(function(err, leagues) {
        if (err)
            return res.render('500');

        res.render('leagues/index', {
            title: 'League and Match Overview',
            leagues: leagues,
            selectedLeague: leagues.length ? leagues[0].id : '',
            getMatchUrl: req.buildFullUrl('league.matches', { leagueId: '#id#' }),
            addLeagueUrl: req.buildFullUrl('leagues')
        });
    });
};

/**
 * Get matches for league
 */
exports.getMatches = function(req, res) {
    
    Match.list({ league: req.league.id }, function(err, matches) {
        if (err)
            return res.send('500', utils.formatErrors(err.errors));

        var options = {
            title: 'Matches for league ' + req.league.name,
            matches: matches
        };

        res.app.render('leagues/matches', options, function (error, html) {
            res.send(html);
        });
    });
};

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

