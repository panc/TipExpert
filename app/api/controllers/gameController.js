
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game'),
    utils = require('../../helper/formatHelper'),
    _ = require('underscore');


var findUserObject = function(containers, id) {

    for (var i = 0; i < containers.length; i++) {
        var container = containers[i];
        if (container.user.id == id || container.user == id)
            return container;
    }

    return null;
};

var prepareUser = function(user) {

    var picture = '';
    if (user.google)
        picture = user.google.picture;
    if (user.facebook)
        picture = user.facebook.picture.data.url;

    return {
        name: user.name,
        picture: picture
    };
};

var prepareGameForPlayer = function(game, userId) {
    var player = findUserObject(game.players, userId);
    var allPlayers = [];
    var tips = [];

    for (var i = 0; i < game.players.length; i++)
        allPlayers.push(prepareUser(game.players[i].user));

    for (var i = 0; i < game.matches.length; i++) {

        var match = game.matches[i];
        var tip = findUserObject(match.tips, userId);

        if (!tip) {
            tip = {
                user: userId,
                homeTeam: match.match.homeTeam,
                guestTeam: match.match.guestTeam
            };
        }

        tips.push(tip);
    }

    return {
        title: game.title,
        description: game.description,
        creator: game.creator.name,
        allPlayers: allPlayers,
        minStake: game.minStake,

        player: {
            stake: player.stake || game.minStake,
            stakeNotSet: player.stake == null,
            tips: tips
        }
    };
};


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
 * Loads a single game the edit view
 */
exports.loadGameForEdit = function(req, res) {

    return res.json(req.game);
};

/**
 * Loads a single game for the players view
 */
exports.loadGameForPlayer = function(req, res) {

    var game = prepareGameForPlayer(req.game, req.user.id);
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
    
    game.title = req.body.title;
    game.creator = req.body.creator;
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

    // todo
    // check that an update can only be done
    // by the creator or by an administrator!

    game.save(function(error) {
        if (error)
            return res.json('500', utils.formatErrors(error.errors || error.err || error));
        
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
