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
    },
    test: {
        db: 'mongodb://localhost/TipExpert_Test',
        root: rootPath,
        app: {
            name: 'Tip Expert - Tests'
        }
    },
    production: {
        
        /* todo */
    }
};
