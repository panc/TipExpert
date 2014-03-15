'use strict';

// define all available modules
angular.module('tipExpert.user', [ 'ngCookies' ]);
angular.module('tipExpert.match', [ ]);
angular.module('tipExpert.game', [ ]);

var tipExpert = angular.module('tipExpert', ['ngRoute', 'tipExpert.home', 'tipExpert.user', 'tipExpert.match', 'ui.bootstrap', 'ui.router']);

// configure the main module
tipExpert.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    var accessLevels = userConfig.accessLevels;

    $stateProvider
    
        // routes for user module
        .state('user', {
            // Note: abstract still needs a ui-view for its children to populate.
            // We can simply add it inline here.
            template: '<ui-view/>',
            url: '/user',
            abstract: true
        })
        .state('user.overview', {
            title: 'Users',
            url: '',
            templateUrl: '/modules/user/views/user.html',
            controller: 'userController',
            access: accessLevels.user
        })
        .state('user.profile', {
            title: 'User profile',
            url: '/:userId',
            templateUrl: '/modules/user/views/profile.html',
            controller: 'userProfileController',
            access: accessLevels.user
        })
    
        // routes for match module
        .state('matches', {
            template: '<ui-view/>',
            url: '/matches',
            abstract: true
        })
        .state('matches.overview', {
            title: 'Matches',
            url: '',
            templateUrl: '/modules/match/views/matches.html',
            controller: 'matchController',
            access: accessLevels.user // todo
        })
        .state('matches.finished', {
            title: 'Not implemented yet!',
            url: '/finished',
            templateUrl: 'todo',
            controller: 'finishedMatchesController',
            access: accessLevels.user
        })
    
        // session routes
        .state('login', {
            title: 'Login',
            url: '/login',
            templateUrl: '/modules/user/views/login.html',
            controller: 'loginController',
            access: accessLevels.public
        })
        .state('signup', {
            title: 'Sign Up',
            url: '/signup',
            templateUrl: '/modules/user/views/signup.html',
            controller: 'signUpController',
            access: accessLevels.public
        })
    
        // routes for home module
        .state('home', {
            title: 'Home',
            url: '/',
            templateUrl: '/modules/home/views/index.html',
            controller: 'homeController',
            access: accessLevels.public
        });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
        return {
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    }]);
}]);

tipExpert.run(['$rootScope', '$location', '$state', 'Auth', function($rootScope, $location, $state, Auth) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if (!Auth.authorize(toState.access)) {

            event.preventDefault();

            if (Auth.user.isLoggedIn)
                $state.go('home');
            else
                $state.go('login');
        }
    });
}]);
