'use strict';

// Declare app level module which depends on filters, and services

var tipExpert = angular.module('tipExpert', ['ngRoute', 'home', 'user']);

tipExpert.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    
    // user routes
//    .when('/user', {
//        templateUrl: 'views/user.html',
//        controller: 'userController'
//    })
    .when('/user/:userId', {
        templateUrl: '/views/profile.html',
        controller: 'userController'
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
}]);