
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game'),
    utils = require('../helper/formatHelper');

exports.updateTipsIfNeeded = function(match) {

    var isMatchFinished = match.homeScore != null && match.guestScore != null;

    if (isMatchFinished)
        console.log('Match finished - update points of all corresponding tips...');
    else
        console.log('Match not finished yet - revert points of all corresponding tips...');
        
    Game.listGamesForMatch(match._id, function(err, games) {
        
        // update tips in games
        games.forEach(function(game) {

            game.matches.forEach(function(gm) {

                if (gm.match != match.id)
                    return;

                gm.tips.forEach(function(tip) {

                    if (isMatchFinished)
                        setPointsForTip(tip, match);
                    else
                        resetPointsForTip(tip);
                });
            });

            game.save(function(error) {
                // todo: 
                // furhter error handling

                if (error)
                    console.log(utils.formatErrors(error));
            });
        });
    });

    console.log('Finished updating all points of all corresponding tips.');
};

var setPointsForTip = function(tip, match) {
    tip.points = 10;
};

var resetPointsForTip = function(tip) {
    tip.points = null;
};