    
var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema;

// game schema
var GameSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    creator: { type: Schema.ObjectId, ref: 'User' },
    minStake: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false },
    
    players: [{
        user: { type : Schema.ObjectId, ref : 'User'},
        stake: { type: Number, default: 0 },
        profit: { type: Number, default: null },
        totalPoints: {type: Number, default: null }
    }],
    
    matches: [{
        match: { type : Schema.ObjectId, ref : 'Match'},
        tips: [{
            user: { type : Schema.ObjectId, ref : 'User'},
            homeScore: { type: Number, default: 0 },
            guestScore: { type: Number, default: 0 },
            points: {type: Number, default: null }
        }]
    }]
});

// validation
GameSchema.path('creator').required(true, 'Creator cannot be blank');
GameSchema.path('title').required(true, 'Title cannot be blank');

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

        if (options.player)
            criteria['players.user'] = new ObjectId(options.player);
        
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
        var criteria = { 'matches.match':  matchId };
        
        this.find(criteria)
            .populate('matches.match')
            .exec(cb);
    }
};

mongoose.model('Game', GameSchema);
