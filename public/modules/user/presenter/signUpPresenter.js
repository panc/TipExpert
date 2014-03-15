'use strict';

var user = angular.module('tipExpert.user');

user.controller('signUpController', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {

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
            function(err) {
                alert(err.errors);
            });
    };
}]);