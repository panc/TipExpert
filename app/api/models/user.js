
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , roles = require('../../../public/modules/user/userConfig').roles
  , oAuthTypes = ['facebook', 'google'];

// user schema
var UserSchema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    role: { type: Number, default: roles.user },
    provider: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    salt: { type: String, default: '' },
    authToken: { type: String, default: '' },
    facebook: { },
    google: { }
});

// virtuals
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });


// validations
var validatePresenceOf = function(value) {
    return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function(name) {
    if (this.doesNotRequireValidation())
        return true;
    
    return name.length;
    
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
    if (this.doesNotRequireValidation())
        return true;

    return email.length;

}, 'Email cannot be blank');

UserSchema.path('email').validate(function(email, fn) {
    
    if (this.doesNotRequireValidation()) 
        fn(true);

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        var user = mongoose.model('User');
        user.find({ email: email })
            .exec(function(err, users) {
                fn(!err && users.length === 0);
            });
    } 
    else {
        fn(true);   
    }
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    if (this.doesNotRequireValidation()) 
        return true;

    return hashed_password.length;
    
}, 'Password cannot be blank');


// pre-save hook
UserSchema.pre('save', function(next) {
    if (!this.isNew)
        return next();

    if (!validatePresenceOf(this.password) && !this.doesNotRequireValidation())
        return next(new Error('Invalid password'));
    else
        return next();
});

// methods for the user schema
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

    encryptPassword: function(password) {
        if (!password)
            return '';

        var encrypred;
        try {
            encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypred;
        } catch(err) {
            return '';
        }
    },

  /**
   * Validation is not required if using OAuth
   */

    doesNotRequireValidation: function() {
        return ~oAuthTypes.indexOf(this.provider);
    }
};

// static methods for the user schema
UserSchema.statics = {
   /**
    * List all user
    */

    list: function(cb) {

        this.find()
            .sort({ 'name': 1 })
            .exec(cb);
    },
    
    /**
     * Find user by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function(id, cb) {
        this.findOne({ _id: id })
            .exec(cb);
    },
};

mongoose.model('User', UserSchema);
