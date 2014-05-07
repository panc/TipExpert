
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game'),
    gameTransformer = require('../../core/gameTransformer'),
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
 * Loads a single game for the edit view
 */
exports.loadGameForEdit = function(req, res) {

    return res.json(req.game);
};

/**
 * Loads a single game for the players view
 */
exports.loadGameForPlayer = function(req, res) {

    var game = gameTransformer.transformToGameForPlayer(req.game, req.user.id);
    return res.json(game);
};

/**
 * List all games for a user
 */
exports.list = function(req, res) {
    
    Game.list({ players: req.user.id }, function(err, games) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));

        return res.json(games);
    });
};

/**
 * List all games for a user
 */
exports.listCreated = function(req, res) {
    
    Game.list({ creator: req.user.id }, function(err, games) {
        if (err)
            return res.json('500', utils.formatErrors(err.errors));

        return res.json(games);
    });
};

/**
 * List all games for a user
 */
exports.listInvited = function(req, res) {
    
    Game.list({ player: req.user.id }, function(err, games) {
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
    game.players.push({ user: req.user });
    
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

    if (game.creator.id != req.user.id)
        return res.json(500, 'Only the creator can update the game!');

    if (game.isFinished)
        return res.json(500, 'A finished game can not be changed!');

    game.title = req.body.title;
    game.minStake = req.body.minStake;
    game.dueDate = req.body.dueDate;
    game.description = req.body.description;
    game.matches = req.body.matches;
    game.players = req.body.players;

    var creatorExists = false;
    for(var i = 0; i < game.players.length; i++) {
        if (game.players[i].user.id == req.user.id) {
            creatorExists = true;
            break;
        }
    }
    
    if (!creatorExists)
        game.players.push({ user: req.user });

    game.save(function(error) {
        if (error)
            return res.json(500, utils.formatErrors(error));
        
        return res.send(game);
    });
};

/**
 * Update stake of a player for a game
 */
exports.updateStake = function(req, res) {
    var game = req.game;
    var player = game.players.id(req.body.playerId);

    if (!player || player.user.id != req.user.id)
        return res.json(500, 'The stake can only be set for the current user!');

     if (game.isFinished)
        return res.json(500, 'The stake can not be changed for a finished game!');

    player.stake = req.body.stake || -1;

    game.save(function(error) {
        if (error)
            return res.json(500, utils.formatErrors(error));

        return res.send({ stake: player.stake });
    });
}

/**
 * Update the tip of a player for a match in a game
 */
exports.updateTip = function(req, res) {
    var game = req.game;
    var tipId = req.body.tip;
    var matchId = req.body.match;
    
    if (game.isFinished)
        return res.json(500, 'Tips can not be changed for a finished game!');

    var match = game.matches.id(matchId);
    if (!match)
         return res.send(500, 'Match not found!');

    var tip = match.tips.id(tipId);
    if (!tip) {
        tip = { user: req.user, homeScore: req.body.homeTip, guestScore: req.body.guestTip };
        match.tips.push(tip);
    }
    else if (tip.user != req.user.id) {
        return res.send(500, 'Wrong user!');
    }

    tip.homeScore = req.body.homeTip;
    tip.guestScore = req.body.guestTip;

    game.save(function(error) {
        if (error)
            return res.json('500', utils.formatErrors(error));
    
        return res.send({ homeScore: tip.homeScore, guestScore: tip.guestScore });
    });
}

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
}