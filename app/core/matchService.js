
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

            finishGameIfNeeded(game);

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

function finishGameIfNeeded(match) {
    // todo
}

function setPointsForTip(tip, match) {
    
    var diffMatch = match.homeScore - match.guestScore;
    var diffTip = tip.homeScore - tip.guestScore;

    if (match.homeScore == tip.homeScore && match.guestScore == tip.guestScore)
        tip.points = 5;
    
    else if ((diffMatch < 0 && diffTip < 0) || (diffMatch >= 0 && diffTip >= 0))
        tip.points = (diffMatch == diffTip) ? 3 : 1;

    else
        tip.points = 0;
};

function resetPointsForTip (tip) {
    tip.points = null;
};