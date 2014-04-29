'use strict';

var homeModule = angular.module('tipExpert.home', []);

homeModule.controller('homeController', [
    '$scope', 'Auth', function($scope, Auth) {

        $scope.user = {
            name: '',
            email: '',
            password: ''
        };

        $scope.signup = function() {
            $scope.submitted = true;

            if ($scope.submitForm.$invalid)
                return;

            Auth.signup($scope.user, function() {
                    $state.go('home');
                },
                toast.error);
        };
    }
]);