    
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , Schema = mongoose.Schema;


// league schema
var LeagueSchema = new Schema({
    name: { type: String, default: '', trim: true },
    createdAt: { type: Date, default: Date.now }
});

// validation
LeagueSchema.path('name').required(true, 'League name cannot be blank');

// static methods for the league schema
LeagueSchema.statics = {
    /**
     * Find league by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     */

    load: function(id, cb) {
        this.findOne({ _id: id })
            .exec(cb);
    },

    /**
     * List leagues
     *
     * @param {Object} options
     * @param {Function} cb
     */

    list: function(cb) {
        this.find({ })
            .sort({ 'name': 1 }) // sort by date
            .exec(cb);
    }
};

mongoose.model('League', LeagueSchema);
