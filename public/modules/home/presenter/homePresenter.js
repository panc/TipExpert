'use strict';

var homeModule = angular.module('tipExpert.home', []);

homeModule.controller('homeController', [
    '$scope', '$state', '$window', 'Auth', 'alertService', function($scope, $state, $window, Auth, alertService) {

        $scope.user = {
            name: '',
            email: '',
            password: ''
        };

        $scope.signup = function() {
            $scope.submitted = true;

            if ($scope.submitForm.$invalid)
                return;

            Auth.signup($scope.user)
				.then(function() {
					$state.go('games.overview');
				})
				.catch(alertService.error);
        };

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    }
]);