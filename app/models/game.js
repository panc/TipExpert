    
var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema;

// game schema
var GameSchema = new Schema({
    creator: { type: Schema.ObjectId, ref: 'User' },
    players: [{
        user: { type : Schema.ObjectId, ref : 'User'},
        stake: { type: Number, default: 0 }
    }],    
    minStake: { type: Number, default: 0 },
    dueDate: { type: Date, default: Date.now }
});

// validation
GameSchema.path('creator').required(true, 'Home team cannot be blank');
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
            .exec(cb);
    },

    /**
     * List matches
     *
     * @param {Object} options
     * @param {Function} cb
     */

    list: function(options, cb) {
        var criteria = {
            league: new ObjectId(options.leagueId)
        };
        
        this.find(criteria)
            .sort({ 'dueDate': 1 }) // sort by date
            .exec(cb);
    }
};

mongoose.model('Game', GameSchema);
