    
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;

// getter
var getTags = function(tags) {
    return tags.join(',');
};

// setter
var setTags = function(tags) {
    return tags.split(',');
};

// article schema
var ArticleSchema = new Schema({
    title: { type: String, default: '', trim: true },
    body: { type: String, default: '', trim: true },
    //user: {type : Schema.ObjectId, ref : 'User'},
    comments: [{
        body: { type: String, default: '' },
        //user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
    tags: { type: [], get: getTags, set: setTags },
    createdAt: { type: Date, default: Date.now }
});

// validations
ArticleSchema.path('title').validate(function(title) {
    return title.length > 0;
}, 'Article title cannot be blank');

ArticleSchema.path('body').validate(function(body) {
    return body.length > 0;
}, 'Article body cannot be blank');

// pre-remove hook
ArticleSchema.pre('remove', function(next) {
    // do something before the article is removed
    // 'this' represents the current article

    next();
});

// article methods
ArticleSchema.methods = {
    /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

    addComment: function(user, comment, cb) {
        this.comments.push({
            body: comment.body,
            user: user._id
        });

        this.save(cb);
    }
};

// static methods for the article schema
ArticleSchema.statics = {
    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function(id, cb) {
        this.findOne({ _id: id })
            //.populate('user', 'name email username')
            //.populate('comments.user')
            .exec(cb);
    },

    /**
     * List articles
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function(options, cb) {
        var criteria = options.criteria || { };

        this.find(criteria)
            //.populate('user', 'name username')
            .sort({ 'createdAt': -1 }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }
};

mongoose.model('Article', ArticleSchema);
