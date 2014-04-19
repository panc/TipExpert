
var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    Game = mongoose.model('Game');

exports.updateTipsIfNeeded = function(match) {

    if (match.homeScore == null || match.guestScore == null) {

        console.log('Match not finished yet - nothing to update!');
        return;
    }

    console.log('Match finished - update all corresponding tips...');

    
};