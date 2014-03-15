'use strict';

var user = angular.module('tipExpert.user');

user.controller('loginController', ['$window', '$scope', '$state', 'Auth', function($window, $scope, $state, Auth) {

    $scope.login = function() {
        $scope.submitted = true;
        
        Auth.login({
                email: $scope.loginForm.email.$modelValue,
                password: $scope.loginForm.password.$modelValue
            },
            function(res) {
                $state.go('home');
            },
            function(err) {
                // todo
                alert(data);
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);