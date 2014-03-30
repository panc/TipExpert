
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game'),
    utils = require('../../helper/formatHelper'),
    _ = require('underscore');
    
/**
 * Load
 */
exports.load = function(req, res, next, id) {
    
    Game.load(id, function(err, game) {
        if (err)
            return next(err);
        if (!game)
            return next(new Error('not found'));
        req.game = game;
        return next();
    });
};

/**
 * Loads a single game
 */
exports.loadGame = function(req, res) {
    
    return res.json(req.game);
};


/**
 * List all games for a user
 */
exports.list = function(req, res) {
    
    Game.list({ userId: req.user.id }, function(err, games) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));

        return res.json(games);
    });
};

/**
 * Create game
 */
exports.create = function(req, res) {
    var game = new Game(req.body);
    game.creator = req.user.id;

    game.save(function(error) {
        if (error)
            return res.json('500', utils.formatErrors(error.errors));
        
        return res.send(game);
    });
};

/**
 * Save game
 */
exports.update = function(req, res) {
    var game = req.game;
    game = _.extend(game, req.body);
    game.matches = req.body.matches;
    game.players = req.body.players;
    
    // todo
    // check that an update can only be done
    // by the creator or by an administrator!

    game.save(function(error) {
        if (error)
            return res.json('500', utils.formatErrors(error.errors));
        
        return res.send(game);
    });
};

/**
 * Delete game
 */
exports.delete = function(req, res) {
    var game = req.game;
    
    // todo
    // check that a game can only be deleted
    // by the creator or by an administrator!

    game.remove(function(err) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));
        
        return res.send(200);
    });
};
