    
var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema;

// game schema
var GameSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    creator: { type: Schema.ObjectId, ref: 'User' },
    minStake: { type: Number, default: 0 },
    dueDate: { type: Date, default: Date.now }, // wenn sich dieses Datum nicht eh automatisch aus dem letzten Match-Datum ergibt...
    
    players: [{
        user: { type : Schema.ObjectId, ref : 'User'},
        stake: { type: Number, default: 0 }
    }],
    
    matches: [{
        match: { type : Schema.ObjectId, ref : 'Match'},
        tips: [{
            user: { type : Schema.ObjectId, ref : 'User'},
            homeScore: { type: Number, default: 0 },
            guestScore: { type: Number, default: 0 }
        }]
    }]
});

// validation
GameSchema.path('creator').required(true, 'Creator cannot be blank');
GameSchema.path('dueDate').required(true, 'Due date cannot be blank');

// static methods for the match schema
GameSchema .statics = {
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
     * List matches
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
    }
};

mongoose.model('Game', GameSchema);
