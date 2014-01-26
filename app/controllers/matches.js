
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Match = mongoose.model('Match'),
    utils = require('../utils/utils');
    
/**
 * Load
 */
exports.loadLeague = function(req, res, next, id) {
    
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
 * Create match
 */
exports.createMatch = function(req, res) {
    
    var match = new Match(req.body);

    match.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(match);
    });
};

/**
 * Save match after edit
 */
exports.updateMatch = function(req, res) {

    
    var match = req.match;
    article = _.extend(article, req.body);

    var match = new Match(req.body);

    match.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(match);
    });
};


/**
 * Create league
 */
exports.createLeague = function(req, res) {
    
    var league = new League(req.body);

    league.save(function(error) {
        if (error)
            return res.send('500', utils.formatErrors(error.errors));
        
        return res.send(league);
    });
};

/**
 * List
 */
var showLeagueList = function(req, res, leagueId) {

    League.list(function(err, leagues) {
        if (err)
            return res.render('500');

        res.render('leagues/index', {
            title: 'League and Match Overview',
            leagues: leagues,
            selectedLeague: (!leagueId && leagues) ? leagues[0].id : leagueId
        });
    });
};

exports.index = function(req, res) {
    showLeagueList(req, res, null);
};

/**
 * Get matches for league
 */
exports.getMatchesForLeague = function(req, res) {

    if (!utils.isAjaxRequest(req))
        return showLeagueList(req, res, req.league.id);
    
    Match.list({ leagueId: req.league.id }, function(err, matches) {
        if (err)
            return res.send('500', utils.formatErrors(err.errors));

        var options = {
            title: 'Matches for league ' + req.league.name,
            matches: matches,
        };

        res.app.render('leagues/matches', options, function (error, html) {
            res.send(html);
        });
    });
};

