'use strict';

var user = angular.module('tipExpert.user');

user.controller('navigationController', ['$scope', '$state', 'Auth', 'alertService', function($scope, $state, Auth, alertService) {

    $scope.user = Auth.user;

    $scope.logout = function() {
        Auth.logout(function() {
            $state.go('home');
        },
        alertService.error);
    };

    $scope.login = function() {
        $scope.submitted = true;
        
        if ($scope.loginForm.$invalid)
                return;

        Auth.login({
                email: $scope.loginForm.email.$modelValue,
                password: $scope.loginForm.password.$modelValue
            },
            function(res) {
                $state.go('games.overview');
            },
            alertService.error);
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
    $scope.alerts = alertService.alerts;

    $scope.closeAlert = function(index) {
        alertService.closeAlert(index);
    };
}]);