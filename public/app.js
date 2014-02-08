'use strict';

var tipExpert = angular.module('tipExpert', ['ngRoute', 'tipExpert.home', 'tipExpert.user', 'ui.bootstrap']);

tipExpert.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    var accessLevels = {
        admin: 1,
        user: 2,
        public: 3
    };

    $routeProvider
    
        // routes for user module
        .when('/user', {
            templateUrl: '/modules/user/views/user.html',
            controller: 'userController',
            access: accessLevels.user
        })
        .when('/user/:userId', {
            templateUrl: '/modules/user/views/profile.html',
            controller: 'userController',
            access: accessLevels.user
        })
        .when('/login', {
            templateUrl: '/modules/user/views/login.html',
            controller: 'loginController',
            access: accessLevels.public
        })
    
        // routes for home module
        .when('/', {
            templateUrl: '/modules/home/views/index.html',
            controller: 'homeController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
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
    });
}]);

tipExpert.run(['$rootScope', '$location', '$http', 'Auth', function($rootScope, $location, $http, Auth) {

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        $rootScope.error = null;
        if (!Auth.authorize(next.access)) {
            if (Auth.isLoggedIn()) $location.path('/');
            else $location.path('/login');
        }
    });

}]);