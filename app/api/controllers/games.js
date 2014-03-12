
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game'),
    utils = require('../../helper/formatHelper');
    
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
exports.index = function(req, res) {

    res.render('games/index');
};

/**
 * Shows the view for creating a new game
 */
exports.new = function(req, res) {

    res.render('games/index');
};

/**
 * Saves the given game
 */
exports.create = function(req, res) {

    res.render('games/index');
};

/**
 * Shows the edit view for the given game
 */
exports.edit = function(req, res) {

    res.render('games/index');
};

/**
 * Saves the changes for the given game
 */
exports.update = function(req, res) {

    res.render('games/index');
};
