
// module dependencies
var minify = require('connect-minify');

module.exports = function(config) {

    var env = process.env.NODE_ENV || 'development';

    return minify({
        // assets map - maps served file identifier to a list of resources
        assets: {
            '/css/main.min.css': [
                //'/bower_components/bootstrap/dist/css/bootstrap.css'
                '/public/css/bootstrap.css',
                '/public/css/site.css'
            ],
            '/js/bower.min.js': [
                '/bower_components/angular/angular.js',
                '/bower_components/angular-bootstrap/ui-bootstrap.js',
                '/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                '/bower_components/angular-route/angular-route.js',
                '/bower_components/angular-cookies/angular-cookies.js',
                '/bower_components/angular-ui-router/release/angular-ui-router.js',
                '/bower_components/angular-translate/angular-translate.js',
                '/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js'
            ],
            '/js/app.min.js': [
                '/public/modules/user/userConfig.js',
                '/public/toast.js',
                '/public/app.js',
                '/public/modules/home/homePresenter.js',
                '/public/modules/user/services/authenticationService.js',
                '/public/modules/user/services/userService.js',
                '/public/modules/user/presenter/loginPresenter.js',
                '/public/modules/user/presenter/navigationPresenter.js',
                '/public/modules/user/presenter/signUpPresenter.js',
                '/public/modules/user/presenter/userPresenter.js',
                '/public/modules/user/presenter/userProfilePresenter.js',
                '/public/modules/match/services/leagueService.js',
                '/public/modules/match/services/matchService.js',
                '/public/modules/match/presenter/matchPresenter.js',
                '/public/modules/match/presenter/editMatchPresenter.js',
                '/public/modules/game/services/gameService.js',
                '/public/modules/game/presenter/gamePresenter.js',
                '/public/modules/game/presenter/myGamesPresenter.js',
                '/public/modules/game/presenter/editGamePresenter.js',
                '/public/modules/game/presenter/addGamePresenter.js',
                '/public/modules/game/presenter/selectMatchesPresenter.js',
                '/public/modules/game/presenter/selectPlayersPresenter.js'
            ]
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
