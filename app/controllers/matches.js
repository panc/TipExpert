
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    League = mongoose.model('League'),
    utils = require('../utils/utils');

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
 * List
 */
exports.index = function(req, res) {
    
    League.list(function(err, leagues) {
        if (err)
            return res.render('500');

        res.render('matches/index', {
            title: 'Match Overview',
            leagues: leagues,
            selectedLeague: leagues.length ? leagues[0].id : '',
            getMatchUrl: req.buildUrl('matches.item', { matchId: '' }),
            addLeagueUrl: req.buildUrl('leagues')
        });
    });
};

/**
 * Edit
 */
exports.edit = function(req, res) {
    console.log(id);
    
    res.app.render('matches/edit', {
        title: 'Match ' + res.league.name,
        league: league
    }, function (error, html) {
        res.send(html);
    });
};

