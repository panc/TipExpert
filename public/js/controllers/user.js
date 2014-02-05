'use strict';

/* User module */

var user = angular.module('user', []);

user.controller('userController', function($scope, $http) {
    $http.get('/api/user').
        success(function(data, status, headers, config) {
            $scope.users = data;
        })
        .error(function(data, status, headers, config) {
            //alert('test'+ status);
        });
});

user.controller('loginController', function($scope) {
    
    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
});