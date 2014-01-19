    
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , Schema = mongoose.Schema;


// league schema
var LeagueSchema = new Schema({
    name: { type: String, default: '', trim: true },
    createdAt: { type: Date, default: Date.now }
});

// static methods for the league schema
LeagueSchema.statics = {
    /**
     * Find league by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
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
     * @api private
     */

    list: function(options, cb) {
        var criteria = options.criteria || { };

        this.find(criteria)
            .sort({ 'name': 1 }) // sort by date
            .exec(cb);
    }
};

mongoose.model('League', LeagueSchema);
