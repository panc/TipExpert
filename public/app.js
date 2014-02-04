'use strict';

// Declare app level module which depends on filters, and services

var tipExpert = angular.module('tipExpert', ['ngRoute', 'home', 'user']);

tipExpert.config(['$routeProvider', '$locationProvider', '$window', '$httpProvider', function($routeProvider, $locationProvider, $window, $httpProvider) {
    $routeProvider
    
    // user routes
    .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'userController'
    })
    .when('/user/:userId', {
        templateUrl: '/views/profile.html',
        controller: 'userController'
    })
    
    // home route
    .when('/', {
        templateUrl: '/views/index.html',
        controller: 'homeController'
    })
//    .otherwise({
//        redirectTo: '/'
//    });

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