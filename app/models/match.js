    
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;


// match schema
var MatchSchema = new Schema({
    league: { type: Schema.ObjectId, ref: 'League' },
    homeTeam: { type: String, default: '', trim: true },
    guestTeam: { type: String, default: '', trim: true },
    dueDate: { type: Date, default: Date.now }
});

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
        var criteria = options.criteria || { };

        this.find(criteria)
            .sort({ 'dueDate': 1 }) // sort by date
            .exec(cb);
    }
};

mongoose.model('Match', MatchSchema);
