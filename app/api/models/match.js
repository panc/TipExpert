    
var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema;


// match schema
var MatchSchema = new Schema({
    league: { type: Schema.ObjectId, ref: 'League' },
    homeTeam: { type: String, default: '', trim: true },
    guestTeam: { type: String, default: '', trim: true },
    homeScore: { type: Number, default: null },
    guestScore: { type: Number, default: null },
    dueDate: { type: Date, default: Date.now }
});

// validation
MatchSchema.path('homeTeam').required(true, 'Home team cannot be blank');
MatchSchema.path('guestTeam').required(true, 'Guest team cannot be blank');
MatchSchema.path('dueDate').required(true, 'Due date cannot be blank');
MatchSchema.path('league').required(true, 'League cannot be blank');

// static methods for the match schema
MatchSchema.statics = {
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
        var criteria = options.leagueId 
            ? { league: new ObjectId(options.leagueId) }
            : { };
        
        this.find(criteria)
            .sort({ 'dueDate': 1 }) // sort by date
            .exec(cb);
    }
};

mongoose.model('Match', MatchSchema);
