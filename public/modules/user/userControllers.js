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

user.controller('userProfileController', ['$http', '$scope', function($http, $scope)  {
    
}]);

user.controller('loginController', ['$window', '$scope', 'Auth', function($window, $scope, Auth) {

    $scope.login = function() {
        $scope.submitted = true;
        
        Auth.login({
                email: $scope.loginForm.email,
                password: $scope.loginForm.password
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                var s = '';
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
}]);

user.controller('navigationController', ['$rootScope', '$scope', '$state', 'Auth', function($rootScope, $scope, $state, Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.user = Auth.user;

    $scope.logout = function() {
        Auth.logout(function() {
            $state.go('login');
            $scope.isLoggedIn = Auth.isLoggedIn();
            $scope.user = Auth.user;
        });
    };
    
}]);