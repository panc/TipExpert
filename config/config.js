// module dependencies
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    templatePath = path.normalize(__dirname + '/../app/mailer/templates');

module.exports = {
    development: {
        db: 'mongodb://localhost/TipExpert',
        root: rootPath,
        app: {
            name: 'Tip Expert'
        },
        facebook: {
            clientID: "404904372977899",
            clientSecret: "0bc86293adce59c1a748d3923f5ff851",
            callbackURL: "http://localhost:1337/auth/facebook/callback"
        },
        google: {
            clientID: "252448485731-nkmpq849obisvg9o22iqkp2o08pidji3.apps.googleusercontent.com",
            clientSecret: "0rmj7j31DP2U-BVpPeZR-_Ia",
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
    heroku: {
        db: process.env.MONGOLAB_URI,
        root: rootPath,
        app: {
            name: 'Tip Expert'
        },
        facebook: {
            clientID: "404904372977899",
            clientSecret: "0bc86293adce59c1a748d3923f5ff851",
            callbackURL: "http://localhost:1337/auth/facebook/callback"
        },
        google: {
            clientID: "252448485731-nkmpq849obisvg9o22iqkp2o08pidji3.apps.googleusercontent.com",
            clientSecret: "0rmj7j31DP2U-BVpPeZR-_Ia",
            callbackURL: "http://localhost:1337/auth/google/callback"
        }
    }
};
