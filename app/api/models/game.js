
var mongoose = require( 'mongoose' ),
    ObjectId = require( 'mongoose' ).Types.ObjectId,
    Schema = mongoose.Schema,
    utils = require( '../../helper/formatHelper' );

// game schema
var GameSchema = new Schema( {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    creator: { type: Schema.ObjectId, ref: 'User' },
    minStake: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false },

    players: [{
        user: { type: Schema.ObjectId, ref: 'User' },
        stake: { type: Number, default: null },
        profit: { type: Number, default: null },
        totalPoints: { type: Number, default: null }
    }],

    matches: [{
        match: { type: Schema.ObjectId, ref: 'Match' },
        tips: [{
            user: { type: Schema.ObjectId, ref: 'User' },
            homeScore: { type: Number, default: 0 },
            guestScore: { type: Number, default: 0 },
            points: { type: Number, default: null }
        }]
    }]
});

// validation
GameSchema.path( 'creator' ).required( true, 'Creator cannot be blank' );
GameSchema.path( 'title' ).required( true, 'Title cannot be blank' );

GameSchema.pre('save', function(next) {
    var err = null;

    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].stake && this.minStake > this.players[i].stake) {
            err = new Error('The stake for a player must be heigher than the defined minimum stake (' + this.minStake + ')!');
        }
    }

    next(err);
});

GameSchema.pre('remove', function(next) {
    var err = null;

    if (this.isFinished)
        err = new Error('A finished game can not be deleted!');

    next(err);
});

// static methods for the match schema
GameSchema.statics = {
    /**
     * Find match by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     */
    load: function(id, cb) {
        this.findOne({ _id: id })
            .populate('creator')
            .populate('matches.match')
            .populate('players.user')
            .exec(cb);
    },

    /**
     * List games
     *
     * @param {Object} options
     * @param {Function} cb
     */

    list: function(options, cb) {
        var criteria = {};

        if (options.creator)
            criteria.creator = new ObjectId(options.creator);

        if (options.notCreator)
            criteria.creator = { $ne: new ObjectId(options.notCreator) };
        
        if (options.player)
            criteria['players.user'] = new ObjectId(options.player);

        if (options.isFinished != null)
            criteria.isFinished = options.isFinished;

        this.find(criteria)
            .sort({ 'dueDate': 1 }) // sort by date
            .exec(cb);
    },

    /**
     * List all games for the given match
     *
     * @param {Object} matchId
     * @param {Function} cb
     */

    listGamesForMatch: function(matchId, cb) {
        var criteria = { 'matches.match': matchId };

        this.find(criteria)
            .populate('matches.match')
            .exec(cb);
    },

    /**
    * Update all tips which are linked with the given match
    */
    updateAllTips: function(match) {

        var isMatchFinished = match.isFinished();
        if (isMatchFinished)
            console.log('Match finished - update points of all corresponding tips...');
        else
            console.log('Match not finished yet - revert points of all corresponding tips...');

        this.listGamesForMatch(match._id, function(err, games) {

            // update tips in games
            games.forEach(function(game) {

                game.matches.forEach(function(gm) {

                    if (gm.match.id != match.id)
                        return;

                    gm.tips.forEach(function(tip) {

                        if (isMatchFinished)
                            setPointsForTip(tip, match);
                        else
                            resetPointsForTip(tip);
                    });
                });

                game.finishGameAndUpdateTotalPoints();

                game.save(function(error) {
                    // todo: 
                    // furhter error handling

                    if (error)
                        console.log(utils.formatErrors(error));
                });
            });
        });

        console.log('Finished updating all points of all corresponding tips.');
    }
};


GameSchema.methods = {
    /**
    * Finish the game if all matches are finished and calculate the total points for each user.
    * If the game is finished, the total points of all users are set.
    * If the game is not finished, the total points of all users are reseted.
    */
    finishGameAndUpdateTotalPoints: function () {

        console.log( "Finish game '" + this.title + "' if needed ..." );

        var userPoints = {};
        var allMatchesFinished = true;

        // calculate total points
        for ( var i = 0; i < this.matches.length; i++ ) {

            var match = this.matches[i];
            if ( !match.match.isFinished() ) {
                allMatchesFinished = false;
                break;
            }

            match.tips.forEach( function ( tip ) {
                var points = userPoints[tip.user] || 0;
                userPoints[tip.user] = points + tip.points;
            });
        }

        // update total points
        this.isFinished = allMatchesFinished;

        if (allMatchesFinished)
            setProfit(this.players, userPoints, this.minStake);
        else
            resetProfit(this.players);
    }
};


mongoose.model( 'Game', GameSchema );


/*
* update points
*/

var setPointsForTip = function ( tip, match ) {

    var diffMatch = match.homeScore - match.guestScore;
    var diffTip = tip.homeScore - tip.guestScore;

    if (match.homeScore == tip.homeScore && match.guestScore == tip.guestScore)
        tip.points = 5;

    else if ((diffMatch < 0 && diffTip < 0) || (diffMatch > 0 && diffTip > 0) || (diffMatch == 0 && diffTip == 0))
        tip.points = ( diffMatch == diffTip ) ? 3 : 1;

    else
        tip.points = 0;
};

var resetPointsForTip = function ( tip ) {
    tip.points = null;
};

/*
* update profit
*/

var setProfit = function (players, userPoints, minStake) {

    var totalStake = 0;

    players.forEach( function ( player ) {
        console.log( 'stake: ' + player.stake );
        totalStake += player.stake || minStake;

        var totalPoints = userPoints[player.user];
        player.totalPoints = totalPoints;
    });

    players.sort( comparePlayer );

    // only 'The winner gets it all' mode is currently supported
    var winner = players[0];

    players.forEach( function ( player ) {

        if ( player == winner )
            player.profit = totalStake;
        else
            player.profit = 0;

        // update the users coins
        var userModel = mongoose.model( 'User' );
        userModel.load( player.user, function ( err, user ) {
            if ( err )
                return;

            user.coins += player.profit;
            user.save();
            console.log( 'user: ' + user.name + ' - cash: ' + user.coins );
        });

        console.log( 'player: ' + player.user + ' - profit: ' + player.profit );
    });
};

var resetProfit = function ( players ) {

    players.forEach( function ( player ) {
        var oldProfit = player.profit;
        player.totalPoints = null;
        player.profit = null;

        if ( oldProfit == 0 )
            return;

        // reset the users coins
        var userModel = mongoose.model( 'User' );
        userModel.load( player.user, function ( err, user ) {
            if ( err )
                return;

            user.coins -= oldProfit;
            user.save();
            console.log( 'user: ' + user.name + ' - cash: ' + user.coins );
        });
    });
}

var comparePlayer = function ( a, b ) {
    if ( !a.totalPoints && !b.totalPoints || a == b )
        return 0;
    if ( !a.totalPoints )
        return 1;
    if ( !b.totalPoints )
        return -1;

    return b.totalPoints - a.totalPoints;
};