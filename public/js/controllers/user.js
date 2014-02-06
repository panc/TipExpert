'use strict';

/* User module */

var user = angular.module('user', []);

user.controller('userController', ['$http', '$scope', function($http, $scope)  {
    $http.get('/api/user').
        success(function(data, status, headers, config) {
            $scope.users = data;
        })
        .error(function(data, status, headers, config) {
            //alert('test'+ status);
        });
}]);


user.controller('loginController', ['$window', '$scope', function($window, $scope) {
    
    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
}]);