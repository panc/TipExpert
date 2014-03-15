'use strict';

var user = angular.module('tipExpert.user');

user.controller('navigationController', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {

    $scope.user = Auth.user;

    $scope.logout = function() {
        Auth.logout(function() {
            $state.go('login');
        },
        function(err) {
            // todo
            alert(data);
        });
    };
    
}]);