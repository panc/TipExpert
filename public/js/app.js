'use strict';

// Declare app level module which depends on filters, and services

var tipExpert = angular.module('tipExpert', ['ngRoute', 'home', 'user']);

tipExpert.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    var accessLevels = {
        admin: 1,
        user: 2,
        public: 3
    };

    $routeProvider
    
        // user routes
        .when('/user', {
            templateUrl: 'views/user/user.html',
            controller: 'userController',
            access: accessLevels.user
        })
        .when('/user/:userId', {
            templateUrl: '/views/user/profile.html',
            controller: 'userController',
            access: accessLevels.user
        })
        .when('/login', {
            templateUrl: '/views/user/login.html',
            controller: 'loginController',
            access: accessLevels.public
        })
    
        // home route
        .when('/', {
            templateUrl: '/views/index.html',
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

//.run(['$rootScope', '$location', '$http', 'Auth', function($rootScope, $location, $http, Auth) {
//
//    $rootScope.$on("$routeChangeStart", function(event, next, current) {
//        $rootScope.error = null;
//        if (!Auth.authorize(next.access)) {
//            if (Auth.isLoggedIn()) $location.path('/');
//            else $location.path('/login');
//        }
//    });
//
//}]);