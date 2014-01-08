// module dependencies
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')

module.exports = {
    development: {
        db: 'mongodb://localhost/TipExpert',
        root: rootPath,
        app: {
            name: 'Tip Expert'
        },
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:1337/auth/facebook/callback" // todo: use a url-helper...
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:1337/auth/google/callback"
        }
    },
    test: {
        db: 'mongodb://localhost/TipExpert_Test',
        root: rootPath,
        app: {
            name: 'Tip Expert - Tests'
        },
        facebook: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:1337/auth/facebook/callback"
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localhost:1337/auth/google/callback"
        }
    },
    production: {
        /* todo */
    }
};
