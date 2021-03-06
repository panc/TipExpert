var mongoose = require('mongoose'), 
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = mongoose.model('User'),
    logger = require('winston');


module.exports = function(passport, config) {

    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function(err, user) {
            done(err, user);
        });
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({ email: email }, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, { message: 'Unknown user' });

                if (!user.authenticate(password))
                    return done(null, false, { message: 'Invalid password' });

                return done(null, user);
            });
        }
    ));

    // use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            profileFields: [ 'id',  'username', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'photos']
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ $or: [ {'facebook.id': profile.id}, {'email': profile.emails[0].value} ] }, function(err, user) {
                if (err)
                    return done(err);

                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        provider: 'facebook'
                    });
                }

                user.facebook = profile._json;

                user.save(function(e) {
                    if (e)
                        logger.log(e);

                    return done(e, user);
                });
            });
        }
    ));

    // use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ $or: [ {'google.id': profile.id}, {'email': profile.emails[0].value} ] }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        provider: 'google',
                    });
                }
                
                user.google = profile._json;

                user.save(function(e) {
                    if (e)
                        logger.log(e);

                    return done(e, user);
                });
            });
        }
    ));
};
