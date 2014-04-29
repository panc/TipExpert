
// module dependencies
var minify = require('connect-minify-ext'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./app-config')[env];

module.exports = function(config) {

    var readModuleFiles = function(path) {
        var results = [];
    
        var list = fs.readdirSync(path);
        list.forEach(function(file) {
            
            file = path + '/' + file;
            var stat = fs.statSync(file);

            if (stat && stat.isDirectory())
                results = results.concat(readModuleFiles(file));
            else if (~file.indexOf('.js') && !~file.indexOf('userConfig.js'))
                results.push(file.replace(config.root, ''));
        });

        return results;
    };

    var modules = readModuleFiles(config.root + '/public/modules');
    var app = [
        '/public/modules/user/userConfig.js',
        '/public/toast.js',
        '/public/app.js'
        ]
        .concat(modules);

    return minify({
        // assets map - maps served file identifier to a list of resources
        assets: {
            '/css/main.min.css': [
                //'/bower_components/bootstrap/dist/css/bootstrap.css'
                '/public/css/bootstrap.css',
                '/public/css/site.css',
                '/public/css/site.theme.css'
            ],
            '/js/bower.min.js': [
                '/bower_components/angular/angular.js',
                '/bower_components/angular-bootstrap/ui-bootstrap.js',
                '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                '/bower_components/angular-route/angular-route.js',
                '/bower_components/angular-cookies/angular-cookies.js',
                '/bower_components/angular-ui-router/release/angular-ui-router.js',
                '/bower_components/angular-translate/angular-translate.js',
                '/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                '/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js'
            ],
            '/js/app.min.js': app
        },
        // root - where resources can be found
        root: config.root,
        development: env === 'development',
        map: {
            '/bower_components/': '/bower/',
            '/public/': '/'
        }
    });
};
