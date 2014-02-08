'use strict';

/* Use the User module (it is defined in the userServices.js) */

var user = angular.module('tipExpert.user');

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

user.controller('navigationController', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    
    $scope.logout = function(provider) {
        Auth.logout(function() {
            $location.path('/login');
        });
    };
    
}]);