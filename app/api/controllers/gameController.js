
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
        req.game = game;
        return next();
    });
};

/**
 * List all games for a user
 */
exports.list = function(req, res) {
    
    Game.list({ userId: req.user.id }, function(err, matches) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));

        return res.json(matches);
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
    
    game.remove(function(err) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));
        
        return res.send(200);
    });
};
