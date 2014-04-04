'use strict';

var user = angular.module('tipExpert.user');

user.controller('userController', ['$scope', 'userService', function($scope, userService)  {

    $scope.roles = [
        { name: 'Admin', index: 1 },
        { name: 'User', index: 2 }
    ];

    $scope.save = function() {
        userService.update($scope.users, function() {
            toast.info('Successfully saved.');
        });
    };
    
    userService.loadAllUser(
        function(users) {
            $scope.users = users;
        },
        toast.error);
}]);