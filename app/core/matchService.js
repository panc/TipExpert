
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
        for (var i = 0; i < games.length; i++) {

            var tips = games[i].matches[0].tips; // a match can only be added once to a game, so matches[0] is ok!
            
            for (var j = 0; j < tips.length; j++) {

                if (isMatchFinished)
                    setPointsForTip(tips[j], match);
                else
                    resetPointsForTip(tips[j]);
            }
        }

        saveAll(games, function(error) {

            // todo: 
            // furhter error handling

            if (error)
                console.log(utils.formatErrors(error));
        });
    });
};

var setPointsForTip = function(tip, match) {
    console.log(tip.homeScore);
    console.log(tip.guestScore);
    tip.points = 10;
    tip.homeScore = 10;
};

var resetPointsForTip = function(tip) {
    tip.points = null;
};

function saveAll(games, callback) {
    var count = 0;
    games.forEach(function(game) {
        game.save(function(err) {
            count++;
            if (count == games.length || err) {
                callback(err);
            }
        });
    });
}